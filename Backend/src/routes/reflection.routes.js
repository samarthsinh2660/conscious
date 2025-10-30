import express from 'express';
import { body } from 'express-validator';
import {
  createReflection,
  getReflections,
  getReflectionById,
  checkTodayReflection,
} from '../controllers/reflection.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('daySummary').notEmpty().withMessage('Day summary is required'),
    body('socialMediaTime').notEmpty().withMessage('Social media time is required'),
    body('truthfulnessKindness').notEmpty().withMessage('Truthfulness and kindness response is required'),
    body('consciousActions').notEmpty().withMessage('Conscious actions response is required'),
    body('overthinkingStress').notEmpty().withMessage('Overthinking/stress response is required'),
    body('gratitudeExpression').notEmpty().withMessage('Gratitude expression is required'),
    body('proudMoment').notEmpty().withMessage('Proud moment is required'),
    validate,
  ],
  createReflection
);

router.get('/', authenticateToken, getReflections);
router.get('/today', authenticateToken, checkTodayReflection);
router.get('/:id', authenticateToken, getReflectionById);

export default router;
