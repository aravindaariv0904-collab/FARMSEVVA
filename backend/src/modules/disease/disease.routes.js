import { Router } from 'express';
import { diseaseController } from './disease.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

// Protect this with JWT
router.post('/identify', authenticateJWT, diseaseController.identify.bind(diseaseController));

export default router;
