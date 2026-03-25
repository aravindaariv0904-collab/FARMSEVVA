import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import soilRoutes from '../modules/soil/soil.routes';
import cropRoutes from '../modules/crop/crop.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/soil', soilRoutes);
router.use('/crop', cropRoutes);

export default router;
