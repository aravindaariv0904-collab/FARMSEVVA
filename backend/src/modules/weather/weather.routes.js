import { Router } from 'express';
import { weatherController } from './weather.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

// Forecast endpoint protected by JWT
router.get('/forecast', authenticateJWT, weatherController.getForecast.bind(weatherController));

export default router;
