import { Router } from 'express';
import { loginOrRegister } from '../controllers/authController';

const router = Router();

router.post('/login', loginOrRegister);

export default router;
