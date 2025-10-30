import express from 'express';
import {
  getAnalysisByReflectionId,
  getLatestAnalysis,
  getAllAnalyses,
} from '../controllers/analysis.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/latest', authenticateToken, getLatestAnalysis);
router.get('/all', authenticateToken, getAllAnalyses);
router.get('/:reflectionId', authenticateToken, getAnalysisByReflectionId);

export default router;
