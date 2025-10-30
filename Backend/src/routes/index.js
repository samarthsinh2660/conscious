import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import reflectionRoutes from './reflection.routes.js';
import analysisRoutes from './analysis.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/reflections', reflectionRoutes);
router.use('/analysis', analysisRoutes);

export default router;
