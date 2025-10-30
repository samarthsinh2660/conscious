import { supabase } from '../config/database.js';

class AnalysisRepository {
  /**
   * Create AI analysis
   * @param {string} userId - User UUID
   * @param {string} reflectionId - Reflection UUID
   * @param {Object} analysisData - Analysis data
   * @returns {Promise<Object>} Created analysis
   */
  async create(userId, reflectionId, analysisData) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .insert([
        {
          user_id: userId,
          reflection_id: reflectionId,
          analysis_text: analysisData.analysisText,
          recommendations: analysisData.recommendations,
          motivational_message: analysisData.motivationalMessage,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find analysis by reflection ID
   * @param {string} reflectionId - Reflection UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Analysis object
   */
  async findByReflectionId(reflectionId, userId) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('reflection_id', reflectionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }

  /**
   * Find latest analysis for user
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>} Analysis object with reflection data or null
   */
  async findLatestByUserId(userId) {
    const { data, error } = await supabase
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

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Find all analyses for user
   * @param {string} userId - User UUID
   * @param {number} limit - Max results
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} Array of analyses with reflection data
   */
  async findAllByUserId(userId, limit = 30, offset = 0) {
    const { data, error } = await supabase
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
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }

  /**
   * Delete analysis
   * @param {string} id - Analysis UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id, userId) {
    const { error } = await supabase
      .from('ai_analysis')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

export default new AnalysisRepository();
