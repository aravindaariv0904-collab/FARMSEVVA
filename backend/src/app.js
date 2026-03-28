import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import authRoutes from './modules/auth/auth.routes.js';
import soilRoutes from './modules/soil/soil.routes.js';
import cropRoutes from './modules/crop/crop.routes.js';
import farmRoutes from './modules/farm/farm.routes.js';
import terraAIRoutes from './modules/terra-ai/terra-ai.routes.js';
import weatherRoutes from './modules/weather/weather.routes.js';
import marketRoutes from './modules/market/market.routes.js';
import diseaseRoutes from './modules/disease/disease.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/soil', soilRoutes);
app.use('/api/v1/crop', cropRoutes);
app.use('/api/v1/farm', farmRoutes);
app.use('/api/terra-ai', terraAIRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/disease', diseaseRoutes);

// Health Check
app.get('/health', async (req, res) => {
    const status = {
        api_server: "UP",
        soilgrids_api: "UNKNOWN",
        openweathermap_api: "UNKNOWN",
        plant_id_api: "UNKNOWN",
        timestamp: new Date()
    };

    try {
        const soilCheck = await axios.get("https://rest.isric.org/soilgrids/v2.0/properties/query", { params: { lat: 0, lon: 0, property: 'clay' }, timeout: 2000 }).catch(() => null);
        status.soilgrids_api = soilCheck ? "UP" : "DOWN";

        const weatherCheck = await axios.get("https://api.openweathermap.org/data/2.5/weather", { params: { lat: 0, lon: 0, appid: process.env.OPENWEATHER_API_KEY }, timeout: 2000 }).catch(() => null);
        status.openweathermap_api = weatherCheck ? "UP" : "DOWN";

        status.plant_id_api = process.env.PLANT_ID_API_KEY ? "CONFIGURED" : "MISSING";

        res.json(status);
    } catch (err) {
        res.status(500).json({ ...status, error: "Partial outage" });
    }
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🌾 Farm Seeva Backend Running!`);
    console.log(` 👉 http://localhost:${PORT}`);
    console.log(`========================================`);
});
