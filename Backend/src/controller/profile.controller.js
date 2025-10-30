import profileService from '../services/profile.service.js';
import { asyncHandler } from '../utils/error.js';

export const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    selfIntroduction,
    goodQualities,
    badQualities,
    lifeGoals,
    challenges,
    additionalInfo,
  } = req.body;

  const profile = await profileService.createOrUpdate(userId, {
    selfIntroduction,
    goodQualities,
    badQualities,
    lifeGoals,
    challenges,
    additionalInfo,
  });

  res.json({
    message: 'Profile saved successfully',
    profile,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const profile = await profileService.getProfile(userId);

  res.json({ profile });
});
