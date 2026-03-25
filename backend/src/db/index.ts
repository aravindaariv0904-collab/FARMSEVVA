import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('query', (e: { query: string; duration: number }) => {
  logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
});

prisma.$on('error', (e: { message: string }) => {
  logger.error(`Prisma Error: ${e.message}`);
});
