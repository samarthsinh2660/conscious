import reflectionRepository from '../repositories/reflection.repository.js';
import profileRepository from '../repositories/profile.repository.js';
import analysisRepository from '../repositories/analysis.repository.js';
import geminiService from './gemini.service.js';
import { ConflictError } from '../utils/error.js';

class ReflectionService {
  async createReflection(userId, reflectionData) {
    // Check if reflection already exists for today
    const existingReflection = await reflectionRepository.findTodayReflection(userId);
    if (existingReflection) {
      throw new ConflictError('You have already submitted a reflection for today');
    }

    // Create reflection
    const reflection = await reflectionRepository.create(userId, reflectionData);

    // Generate AI analysis asynchronously
    this.generateAnalysisAsync(userId, reflection).catch(error => {
      console.error('Error generating AI analysis:', error);
    });

    return this.formatReflection(reflection);
  }

  async generateAnalysisAsync(userId, reflection) {
    try {
      // Get user profile for context
      const profile = await profileRepository.findByUserId(userId);

      // Get previous reflections for pattern analysis
      const previousReflections = await reflectionRepository.findRecentReflections(userId, 8);

      // Generate AI analysis
      const analysis = await geminiService.generateReflectionAnalysis(
        profile,
        reflection,
        previousReflections
      );

      // Store analysis
      await analysisRepository.create(userId, reflection.id, analysis);
    } catch (error) {
      console.error('Failed to generate AI analysis:', error);
      throw error;
    }
  }

  async getReflections(userId, limit = 30, offset = 0) {
    const reflections = await reflectionRepository.findByUserId(userId, limit, offset);
    return reflections.map(this.formatReflection);
  }

  async getReflectionById(userId, reflectionId) {
    const reflection = await reflectionRepository.findById(reflectionId, userId);
    return this.formatReflection(reflection);
  }

  async checkTodayReflection(userId) {
    const reflection = await reflectionRepository.findTodayReflection(userId);
    return {
      exists: !!reflection,
      reflectionId: reflection?.id || null,
    };
  }

  formatReflection(reflection) {
    return {
      id: reflection.id,
      reflectionDate: reflection.reflection_date,
      daySummary: reflection.day_summary,
      socialMediaTime: reflection.social_media_time,
      truthfulnessKindness: reflection.truthfulness_kindness,
      consciousActions: reflection.conscious_actions,
      overthinkingStress: reflection.overthinking_stress,
      gratitudeExpression: reflection.gratitude_expression,
      proudMoment: reflection.proud_moment,
      createdAt: reflection.created_at,
    };
  }
}

export default new ReflectionService();
