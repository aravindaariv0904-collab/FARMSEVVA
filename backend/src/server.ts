import app from './app';
import { prisma } from './db';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err: Error) => {
  logger.fatal('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully.');

    const server = app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });

    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
