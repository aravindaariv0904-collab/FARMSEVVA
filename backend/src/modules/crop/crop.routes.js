import { Router } from 'express';
import { cropController } from './crop.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/v1/crop/recommend?farmId=xxx
 * @desc    Get top 5 AI-driven crop recommendations for a farm
 * @access  Private (JWT Auth)
 */
router.get('/recommend', authenticateJWT, cropController.recommend.bind(cropController));

export default router;
