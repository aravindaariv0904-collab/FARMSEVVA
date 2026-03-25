import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { z } from 'zod';

export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }

  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(`Unexpected error: ${err.stack || err.message}`);
  return res.status(500).json({ error: 'Internal Server Error' });
};
