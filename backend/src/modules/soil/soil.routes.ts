import { Router } from 'express';
import { saveSoil, getLatest } from './soil.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { soilSaveSchema } from './soil.schema';

const router = Router();

// POST /api/v1/soil
router.post('/', authenticate, validate(soilSaveSchema), saveSoil);

// GET /api/v1/soil/latest
router.get('/latest', authenticate, getLatest);

export default router;
