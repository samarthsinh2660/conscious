import { getGeminiModel } from '../config/gemini.js';

class GeminiService {
  async generateReflectionAnalysis(userProfile, currentReflection, previousReflections = []) {
    try {
      const model = getGeminiModel();
      const prompt = buildAnalysisPrompt(userProfile, currentReflection, previousReflections);
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return parseAnalysisResponse(response);
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw new Error('Failed to generate AI analysis');
    }
  }
}

export default new GeminiService();

function buildAnalysisPrompt(profile, reflection, previousReflections) {
  return `You are a compassionate life coach and consciousness guide. Analyze the following daily reflection and provide personalized insights.

USER PROFILE (Background Context):
- Self Introduction: ${profile?.self_introduction || 'Not provided'}
- Good Qualities: ${profile?.good_qualities || 'Not provided'}
- Areas for Improvement: ${profile?.bad_qualities || 'Not provided'}
- Life Goals: ${profile?.life_goals || 'Not provided'}
- Challenges: ${profile?.challenges || 'Not provided'}

TODAY'S REFLECTION:
1. Day Summary: ${reflection.day_summary}
2. Social Media Usage: ${reflection.social_media_time}
3. Truthfulness & Kindness: ${reflection.truthfulness_kindness}
4. Conscious vs Impulsive Actions: ${reflection.conscious_actions}
5. Overthinking/Stress: ${reflection.overthinking_stress}
6. Gratitude Expression: ${reflection.gratitude_expression}
7. Proud Moment: ${reflection.proud_moment}

${previousReflections && previousReflections.length > 1 ? `
RECENT PATTERNS (Last ${previousReflections.length - 1} days):
${previousReflections.slice(1).map((r, i) => `
Day ${i + 1} (${r.reflection_date}):
- Summary: ${r.day_summary}
- Social Media: ${r.social_media_time}
- Conscious Actions: ${r.conscious_actions}
- Proud Moment: ${r.proud_moment}
`).join('\n')}
` : ''}

Please provide a comprehensive analysis in the following format:

**ANALYSIS:**
[Provide a thoughtful analysis of today's reflection, acknowledging both positive aspects and areas of concern. Be specific and reference their actions. Consider their background from the profile and any patterns from previous days.]

**RECOMMENDATIONS:**
[Provide 3-5 specific, actionable recommendations for improvement. Consider their profile background and recent patterns. Be practical and encouraging. Format as a numbered or bulleted list.]

**MOTIVATIONAL MESSAGE:**
[End with an uplifting, personalized message that acknowledges their progress and encourages continued growth. Make it warm and genuine. Keep it concise but impactful.]

Keep the tone supportive, non-judgmental, and focused on growth. Be specific and avoid generic advice. Reference specific details from their reflection to show you're paying attention.`;
}

function parseAnalysisResponse(response) {
  const sections = {
    analysisText: '',
    recommendations: '',
    motivationalMessage: '',
  };

  try {
    // Try to parse structured response
    const analysisMatch = response.match(/\*\*ANALYSIS:\*\*([\s\S]*?)(?=\*\*RECOMMENDATIONS:\*\*|$)/);
    const recommendationsMatch = response.match(/\*\*RECOMMENDATIONS:\*\*([\s\S]*?)(?=\*\*MOTIVATIONAL MESSAGE:\*\*|$)/);
    const motivationalMatch = response.match(/\*\*MOTIVATIONAL MESSAGE:\*\*([\s\S]*?)$/);

    if (analysisMatch) {
      sections.analysisText = analysisMatch[1].trim();
    }
    
    if (recommendationsMatch) {
      sections.recommendations = recommendationsMatch[1].trim();
    }
    
    if (motivationalMatch) {
      sections.motivationalMessage = motivationalMatch[1].trim();
    }

    // Fallback if parsing fails - use entire response as analysis
    if (!sections.analysisText && !sections.recommendations && !sections.motivationalMessage) {
      sections.analysisText = response;
      sections.recommendations = 'Continue your journey of self-reflection and growth.';
      sections.motivationalMessage = 'Keep up the great work on your path to self-awareness!';
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
    sections.analysisText = response;
    sections.recommendations = 'Continue your journey of self-reflection and growth.';
    sections.motivationalMessage = 'Keep up the great work on your path to self-awareness!';
  }

  return sections;
}
