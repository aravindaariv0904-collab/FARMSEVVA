import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);

// Protected routes example
router.get('/health', authenticate, (req: Request, res: Response) => {
  res.json({ status: 'ok', user: (req as any).user });
});

export default router;
