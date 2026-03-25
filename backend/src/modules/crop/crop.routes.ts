import { Router } from 'express';
import { recommend } from './crop.controller';
import { validate } from '../../middleware/validate';
import { cropRecommendSchema } from './crop.schema';

const router = Router();

// POST /api/v1/crop/recommend
router.post('/recommend', validate(cropRecommendSchema), recommend);

export default router;
