import analysisService from '../services/analysis.service.js';
import { asyncHandler } from '../utils/error.js';

export const getAnalysisByReflectionId = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { reflectionId } = req.params;

  const analysis = await analysisService.getAnalysisByReflectionId(userId, reflectionId);

  res.json({ analysis });
});

export const getLatestAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const analysis = await analysisService.getLatestAnalysis(userId);

  res.json({ analysis });
});

export const getAllAnalyses = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { limit = 30, offset = 0 } = req.query;

  const analyses = await analysisService.getAllAnalyses(
    userId,
    parseInt(limit),
    parseInt(offset)
  );

  res.json({ analyses });
});
