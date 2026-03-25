import { Router } from 'express';
import { login } from './auth.controller';
import { validate } from '../../middleware/validate';
import { loginSchema } from './auth.schema';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login);

export default router;
