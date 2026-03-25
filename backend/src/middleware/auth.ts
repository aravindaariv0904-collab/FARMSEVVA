import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { AppError } from './errorHandler';
import { prisma } from '../db';
import { logger } from '../utils/logger';

// Initialize Firebase Admin (mocked for demo, should provide credentials in production)
try {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
} catch (error) {
  logger.warn('Firebase Admin initialization skipped (missing credentials in dev)');
}

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized: Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    
    // In a real environment, use VerifyIdToken
    // const decodedToken = await admin.auth().verifyIdToken(token);
    
    // For demo/development purposes, we mock verification
    const decodedToken = { uid: token === 'mock-token' ? 'mock-uid' : token };

    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      throw new AppError(401, 'Unauthorized: User not found in database');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError(401, 'Unauthorized: Invalid token'));
  }
};
