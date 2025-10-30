import reflectionService from '../services/reflection.service.js';
import { asyncHandler } from '../utils/error.js';

export const createReflection = asyncHandler(async (req, res) => {
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

  const reflection = await reflectionService.createReflection(userId, {
    daySummary,
    socialMediaTime,
    truthfulnessKindness,
    consciousActions,
    overthinkingStress,
    gratitudeExpression,
    proudMoment,
  });

  res.status(201).json({
    message: 'Reflection submitted successfully',
    reflection,
  });
});

export const getReflections = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { limit = 30, offset = 0 } = req.query;

  const reflections = await reflectionService.getReflections(
    userId,
    parseInt(limit),
    parseInt(offset)
  );

  res.json({ reflections });
});

export const getReflectionById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const reflection = await reflectionService.getReflectionById(userId, id);

  res.json({ reflection });
});

export const checkTodayReflection = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const result = await reflectionService.checkTodayReflection(userId);

  res.json(result);
});
