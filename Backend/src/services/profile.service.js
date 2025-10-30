import profileRepository from '../repositories/profile.repository.js';

class ProfileService {
  async createOrUpdate(userId, profileData) {
    // Check if profile exists
    const existingProfile = await profileRepository.findByUserId(userId);

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await profileRepository.update(userId, profileData);
    } else {
      // Create new profile
      profile = await profileRepository.create(userId, profileData);
    }

    return {
      id: profile.id,
      selfIntroduction: profile.self_introduction,
      goodQualities: profile.good_qualities,
      badQualities: profile.bad_qualities,
      lifeGoals: profile.life_goals,
      challenges: profile.challenges,
      additionalInfo: profile.additional_info,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  async getProfile(userId) {
    const profile = await profileRepository.findByUserId(userId);
    
    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      selfIntroduction: profile.self_introduction,
      goodQualities: profile.good_qualities,
      badQualities: profile.bad_qualities,
      lifeGoals: profile.life_goals,
      challenges: profile.challenges,
      additionalInfo: profile.additional_info,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }
}

export default new ProfileService();
