import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../middleware/asyncHandler';

/**
 * Handles phone number based login.
 * The input is already validated by the `validate` middleware.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  const result = await authService.login(phoneNumber);
  res.status(200).json(result);
});
