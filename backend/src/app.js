import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes.js';
import soilRoutes from './modules/soil/soil.routes.js';
import cropRoutes from './modules/crop/crop.routes.js';
import farmRoutes from './modules/farm/farm.routes.js';
import terraAIRoutes from './modules/terra-ai/terra-ai.routes.js';
import weatherRoutes from './modules/weather/weather.routes.js';
import marketRoutes from './modules/market/market.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/soil', soilRoutes);
app.use('/api/v1/crop', cropRoutes);
app.use('/api/v1/farm', farmRoutes);
app.use('/api/terra-ai', terraAIRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🌾 Farm Seeva Backend Running!`);
    console.log(` 👉 http://localhost:${PORT}`);
    console.log(`========================================`);
});
