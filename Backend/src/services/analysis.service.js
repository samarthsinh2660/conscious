import analysisRepository from '../repositories/analysis.repository.js';
import reflectionRepository from '../repositories/reflection.repository.js';
import { NotFoundError } from '../utils/error.js';

class AnalysisService {
  async getAnalysisByReflectionId(userId, reflectionId) {
    // Verify reflection belongs to user
    const reflection = await reflectionRepository.findById(reflectionId, userId);
    if (!reflection) {
      throw new NotFoundError('Reflection not found');
    }

    const analysis = await analysisRepository.findByReflectionId(reflectionId, userId);
    if (!analysis) {
      throw new NotFoundError('Analysis not found for this reflection');
    }

    return this.formatAnalysis(analysis);
  }

  async getLatestAnalysis(userId) {
    const analysis = await analysisRepository.findLatestByUserId(userId);
    
    if (!analysis) {
      return null;
    }

    return {
      id: analysis.id,
      reflectionId: analysis.reflection_id,
      analysisText: analysis.analysis_text,
      recommendations: analysis.recommendations,
      motivationalMessage: analysis.motivational_message,
      createdAt: analysis.created_at,
      reflectionDate: analysis.daily_reflections?.reflection_date,
      daySummary: analysis.daily_reflections?.day_summary,
    };
  }

  async getAllAnalyses(userId, limit = 30, offset = 0) {
    const analyses = await analysisRepository.findAllByUserId(userId, limit, offset);
    
    return analyses.map(analysis => ({
      id: analysis.id,
      reflectionId: analysis.reflection_id,
      analysisText: analysis.analysis_text,
      recommendations: analysis.recommendations,
      motivationalMessage: analysis.motivational_message,
      createdAt: analysis.created_at,
      reflectionDate: analysis.daily_reflections?.reflection_date,
      daySummary: analysis.daily_reflections?.day_summary,
    }));
  }

  formatAnalysis(analysis) {
    return {
      id: analysis.id,
      reflectionId: analysis.reflection_id,
      analysisText: analysis.analysis_text,
      recommendations: analysis.recommendations,
      motivationalMessage: analysis.motivational_message,
      createdAt: analysis.created_at,
    };
  }
}

export default new AnalysisService();
