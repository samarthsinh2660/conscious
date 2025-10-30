import { supabase } from '../config/database.js';
import { getGeminiModel } from '../config/gemini.js';

export const createReflection = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      daySummary,
      socialMediaTime,
      truthfulnessKindness,
      consciousActions,
      overthinkingStress,
      gratitudeExpression,
      proudMoment,
    } = req.body;

    const today = new Date().toISOString().split('T')[0];

    // Check if reflection already exists for today
    const { data: existingReflection } = await supabase
      .from('daily_reflections')
      .select('id')
      .eq('user_id', userId)
      .eq('reflection_date', today)
      .single();

    if (existingReflection) {
      return res.status(400).json({ 
        error: 'You have already submitted a reflection for today' 
      });
    }

    // Create reflection
    const { data: reflection, error } = await supabase
      .from('daily_reflections')
      .insert([
        {
          user_id: userId,
          reflection_date: today,
          day_summary: daySummary,
          social_media_time: socialMediaTime,
          truthfulness_kindness: truthfulnessKindness,
          conscious_actions: consciousActions,
          overthinking_stress: overthinkingStress,
          gratitude_expression: gratitudeExpression,
          proud_moment: proudMoment,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Generate AI analysis
    try {
      const analysis = await generateAIAnalysis(userId, reflection);
      
      // Store AI analysis
      await supabase
        .from('ai_analysis')
        .insert([
          {
            user_id: userId,
            reflection_id: reflection.id,
            analysis_text: analysis.analysis,
            recommendations: analysis.recommendations,
            motivational_message: analysis.motivationalMessage,
          },
        ]);
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      // Continue even if AI analysis fails
    }

    res.status(201).json({
      message: 'Reflection submitted successfully',
      reflection: {
        id: reflection.id,
        reflectionDate: reflection.reflection_date,
        daySummary: reflection.day_summary,
        socialMediaTime: reflection.social_media_time,
        truthfulnessKindness: reflection.truthfulness_kindness,
        consciousActions: reflection.conscious_actions,
        overthinkingStress: reflection.overthinking_stress,
        gratitudeExpression: reflection.gratitude_expression,
        proudMoment: reflection.proud_moment,
      },
    });
  } catch (error) {
    console.error('Create reflection error:', error);
    res.status(500).json({ error: 'Failed to create reflection' });
  }
};

export const getReflections = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 30, offset = 0 } = req.query;

    const { data: reflections, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      reflections: reflections.map((r) => ({
        id: r.id,
        reflectionDate: r.reflection_date,
        daySummary: r.day_summary,
        socialMediaTime: r.social_media_time,
        truthfulnessKindness: r.truthfulness_kindness,
        consciousActions: r.conscious_actions,
        overthinkingStress: r.overthinking_stress,
        gratitudeExpression: r.gratitude_expression,
        proudMoment: r.proud_moment,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('Get reflections error:', error);
    res.status(500).json({ error: 'Failed to get reflections' });
  }
};

export const getReflectionById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const { data: reflection, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !reflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }

    res.json({
      reflection: {
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
      },
    });
  } catch (error) {
    console.error('Get reflection error:', error);
    res.status(500).json({ error: 'Failed to get reflection' });
  }
};

export const checkTodayReflection = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    const { data: reflection } = await supabase
      .from('daily_reflections')
      .select('id, reflection_date')
      .eq('user_id', userId)
      .eq('reflection_date', today)
      .single();

    res.json({
      exists: !!reflection,
      reflectionId: reflection?.id || null,
    });
  } catch (error) {
    console.error('Check today reflection error:', error);
    res.status(500).json({ error: 'Failed to check reflection' });
  }
};

// Helper function to generate AI analysis
async function generateAIAnalysis(userId, reflection) {
  try {
    // Get user profile for context
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get previous reflections for context (last 7 days)
    const { data: previousReflections } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })
      .limit(7);

    const model = getGeminiModel();

    const prompt = `You are a compassionate life coach and consciousness guide. Analyze the following daily reflection and provide personalized insights.

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
`).join('\n')}
` : ''}

Please provide a comprehensive analysis in the following format:

**ANALYSIS:**
[Provide a thoughtful analysis of today's reflection, acknowledging both positive aspects and areas of concern. Be specific and reference their actions.]

**RECOMMENDATIONS:**
[Provide 3-5 specific, actionable recommendations for improvement. Consider their profile background and recent patterns. Be practical and encouraging.]

**MOTIVATIONAL MESSAGE:**
[End with an uplifting, personalized message that acknowledges their progress and encourages continued growth. Make it warm and genuine.]

Keep the tone supportive, non-judgmental, and focused on growth. Be specific and avoid generic advice.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response
    const sections = {
      analysis: '',
      recommendations: '',
      motivationalMessage: '',
    };

    const analysisMatch = response.match(/\*\*ANALYSIS:\*\*([\s\S]*?)(?=\*\*RECOMMENDATIONS:\*\*|$)/);
    const recommendationsMatch = response.match(/\*\*RECOMMENDATIONS:\*\*([\s\S]*?)(?=\*\*MOTIVATIONAL MESSAGE:\*\*|$)/);
    const motivationalMatch = response.match(/\*\*MOTIVATIONAL MESSAGE:\*\*([\s\S]*?)$/);

    if (analysisMatch) sections.analysis = analysisMatch[1].trim();
    if (recommendationsMatch) sections.recommendations = recommendationsMatch[1].trim();
    if (motivationalMatch) sections.motivationalMessage = motivationalMatch[1].trim();

    // Fallback if parsing fails
    if (!sections.analysis && !sections.recommendations && !sections.motivationalMessage) {
      sections.analysis = response;
    }

    return sections;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}
