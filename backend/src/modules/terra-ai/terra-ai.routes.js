import { Router } from 'express';
import { terraAIController } from './terra-ai.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

// Protect this route with JWT
router.post('/chat', authenticateJWT, terraAIController.chat.bind(terraAIController));

export default router;
