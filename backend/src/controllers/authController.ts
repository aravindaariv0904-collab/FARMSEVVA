import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { z } from 'zod';

const loginSchema = z.object({
  firebaseUid: z.string(),
  phoneNumber: z.string().min(10),
  name: z.string().optional(),
});

export const loginOrRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid, phoneNumber, name } = loginSchema.parse(req.body);

    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          phoneNumber,
          name: name || 'Farmer',
        },
      });
      logger.info(`New user registered: ${user.id}`);
    } else {
      logger.info(`User logged in: ${user.id}`);
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        // In a real scenario, you might also return a custom JWT if you don't solely rely on Firebase
        token: 'mock-token', 
      },
    });
  } catch (error) {
    next(error);
  }
};
