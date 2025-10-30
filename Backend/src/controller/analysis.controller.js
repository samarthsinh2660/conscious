import { supabase } from '../config/database.js';

export const getAnalysisByReflectionId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reflectionId } = req.params;

    // Verify reflection belongs to user
    const { data: reflection } = await supabase
      .from('daily_reflections')
      .select('id')
      .eq('id', reflectionId)
      .eq('user_id', userId)
      .single();

    if (!reflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }

    const { data: analysis, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('reflection_id', reflectionId)
      .eq('user_id', userId)
      .single();

    if (error || !analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      analysis: {
        id: analysis.id,
        reflectionId: analysis.reflection_id,
        analysisText: analysis.analysis_text,
        recommendations: analysis.recommendations,
        motivationalMessage: analysis.motivational_message,
        createdAt: analysis.created_at,
      },
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
};

export const getLatestAnalysis = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: analysis, error } = await supabase
      .from('ai_analysis')
      .select(`
        *,
        daily_reflections (
          reflection_date,
          day_summary
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !analysis) {
      return res.json({ analysis: null });
    }

    res.json({
      analysis: {
        id: analysis.id,
        reflectionId: analysis.reflection_id,
        analysisText: analysis.analysis_text,
        recommendations: analysis.recommendations,
        motivationalMessage: analysis.motivational_message,
        createdAt: analysis.created_at,
        reflectionDate: analysis.daily_reflections?.reflection_date,
        daySummary: analysis.daily_reflections?.day_summary,
      },
    });
  } catch (error) {
    console.error('Get latest analysis error:', error);
    res.status(500).json({ error: 'Failed to get latest analysis' });
  }
};

export const getAllAnalyses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 30, offset = 0 } = req.query;

    const { data: analyses, error } = await supabase
      .from('ai_analysis')
      .select(`
        *,
        daily_reflections (
          reflection_date,
          day_summary
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      analyses: analyses.map((a) => ({
        id: a.id,
        reflectionId: a.reflection_id,
        analysisText: a.analysis_text,
        recommendations: a.recommendations,
        motivationalMessage: a.motivational_message,
        createdAt: a.created_at,
        reflectionDate: a.daily_reflections?.reflection_date,
        daySummary: a.daily_reflections?.day_summary,
      })),
    });
  } catch (error) {
    console.error('Get all analyses error:', error);
    res.status(500).json({ error: 'Failed to get analyses' });
  }
};
