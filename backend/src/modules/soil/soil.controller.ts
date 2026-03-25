import { Request, Response } from 'express';
import { soilService } from './soil.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const saveSoil = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { ph, nitrogen, phosphorus, potassium } = req.body;
  const result = await soilService.saveSoilData(userId, { ph, nitrogen, phosphorus, potassium });
  res.status(201).json(result);
});

export const getLatest = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await soilService.getLatestSoilData(userId);
  res.status(200).json(result);
});
