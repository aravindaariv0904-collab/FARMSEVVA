import { Request, Response } from 'express';
import { cropService } from './crop.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const recommend = asyncHandler(async (req: Request, res: Response) => {
  const { ph, nitrogen, phosphorus, potassium } = req.body;
  const result = await cropService.recommendCrops(ph, nitrogen, phosphorus, potassium);
  res.status(200).json({ recommendations: result });
});
