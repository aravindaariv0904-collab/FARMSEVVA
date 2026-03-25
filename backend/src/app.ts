import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { errorHandler, AppError } from './middleware/errorHandler';
import routes from './routes';

const app: Application = express();

// 1. Security Headers (Best practice for production)
app.use(helmet());

// 2. CORS (Restrict origins in production)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Request Logging (Production-ready logging)
app.use(pinoHttp({ 
    logger, 
    autoLogging: process.env.NODE_ENV === 'production',
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    }
}));

// 4. Rate Limiting (Prevent DDoS/Abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes.
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Apply rate limit to all /api routes
app.use('/api', limiter);

// 5. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// 7. API Routes
app.use('/api/v1', routes);

// 8. 404 Handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found on this server`));
});

// 9. Global Error Handler (Production-ready)
app.use(errorHandler);

export default app;
