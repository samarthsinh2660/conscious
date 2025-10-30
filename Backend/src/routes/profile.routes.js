import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateProfile, getProfile } from '../controller/profile.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('selfIntroduction').notEmpty().withMessage('Self introduction is required'),
    body('goodQualities').notEmpty().withMessage('Good qualities are required'),
    body('badQualities').notEmpty().withMessage('Bad qualities are required'),
    body('lifeGoals').notEmpty().withMessage('Life goals are required'),
    body('challenges').notEmpty().withMessage('Challenges are required'),
    validate,
  ],
  createOrUpdateProfile
);

router.get('/', authenticateToken, getProfile);

export default router;
