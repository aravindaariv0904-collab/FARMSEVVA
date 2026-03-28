import { Router } from 'express';
import { marketController } from './market.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

// Price search endpoint protected by JWT
router.get('/prices', authenticateJWT, marketController.getPrices.bind(marketController));

export default router;
