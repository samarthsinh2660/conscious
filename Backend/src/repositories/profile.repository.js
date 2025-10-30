import { supabase } from '../config/database.js';

class ProfileRepository {
  /**
   * Create user profile
   * @param {string} userId - User UUID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Created profile
   */
  async create(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          self_introduction: profileData.selfIntroduction,
          good_qualities: profileData.goodQualities,
          bad_qualities: profileData.badQualities,
          life_goals: profileData.lifeGoals,
          challenges: profileData.challenges,
          additional_info: profileData.additionalInfo,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find profile by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>} Profile object or null
   */
  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Update profile by user ID
   * @param {string} userId - User UUID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async update(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        self_introduction: profileData.selfIntroduction,
        good_qualities: profileData.goodQualities,
        bad_qualities: profileData.badQualities,
        life_goals: profileData.lifeGoals,
        challenges: profileData.challenges,
        additional_info: profileData.additionalInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete profile by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  async delete(userId) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  /**
   * Check if profile exists for user
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Exists status
   */
  async existsByUserId(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
}

export default new ProfileRepository();
