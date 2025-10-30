import { supabase } from '../config/database.js';

class ReflectionRepository {
  /**
   * Create daily reflection
   * @param {string} userId - User UUID
   * @param {Object} reflectionData - Reflection data
   * @returns {Promise<Object>} Created reflection
   */
  async create(userId, reflectionData) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_reflections')
      .insert([
        {
          user_id: userId,
          reflection_date: today,
          day_summary: reflectionData.daySummary,
          social_media_time: reflectionData.socialMediaTime,
          truthfulness_kindness: reflectionData.truthfulnessKindness,
          conscious_actions: reflectionData.consciousActions,
          overthinking_stress: reflectionData.overthinkingStress,
          gratitude_expression: reflectionData.gratitudeExpression,
          proud_moment: reflectionData.proudMoment,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find reflections by user ID
   * @param {string} userId - User UUID
   * @param {number} limit - Max results
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} Array of reflections
   */
  async findByUserId(userId, limit = 30, offset = 0) {
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }

  /**
   * Find reflection by ID
   * @param {string} id - Reflection UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Reflection object
   */
  async findById(id, userId) {
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find reflection by date
   * @param {string} userId - User UUID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object|null>} Reflection object or null
   */
  async findByDate(userId, date) {
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .eq('reflection_date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Find today's reflection for user
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>} Reflection object or null
   */
  async findTodayReflection(userId) {
    const today = new Date().toISOString().split('T')[0];
    return await this.findByDate(userId, today);
  }

  /**
   * Find recent reflections
   * @param {string} userId - User UUID
   * @param {number} days - Number of days to fetch
   * @returns {Promise<Array>} Array of reflections
   */
  async findRecentReflections(userId, days = 7) {
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })
      .limit(days);

    if (error) throw error;
    return data;
  }

  /**
   * Update reflection
   * @param {string} id - Reflection UUID
   * @param {string} userId - User UUID
   * @param {Object} reflectionData - Updated data
   * @returns {Promise<Object>} Updated reflection
   */
  async update(id, userId, reflectionData) {
    const { data, error } = await supabase
      .from('daily_reflections')
      .update(reflectionData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete reflection
   * @param {string} id - Reflection UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id, userId) {
    const { error } = await supabase
      .from('daily_reflections')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

export default new ReflectionRepository();
