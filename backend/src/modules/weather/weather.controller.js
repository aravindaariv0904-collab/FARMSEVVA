import { weatherService } from './weather.service.js';
import { connectRedis } from '../../utils/redis.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class WeatherController {
  async getForecast(req, res) {
    const { farmId } = req.query;

    if (!farmId) {
      return res.status(400).json({ success: false, message: "farmId is required" });
    }

    try {
      const redis = await connectRedis();
      const cacheKey = `weather_forecast_${farmId}`;

      // 1. Check Redis Cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`🌤️ Serving weather from Redis cache for farmId: ${farmId}`);
        return res.status(200).json({
          success: true,
          data: JSON.parse(cached),
          cached: true
        });
      }

      // 2. Fetch Farm Coordinates
      const farm = await prisma.farm.findUnique({ where: { id: farmId } });
      if (!farm || !farm.gpsLat || !farm.gpsLng) {
        return res.status(404).json({ success: false, message: "Farm coordinates missing" });
      }

      // 3. Call Service
      const forecast = await weatherService.getForecast(farm.gpsLat, farm.gpsLng);

      // 4. Cache in Redis for 6 hours (21600 seconds)
      await redis.set(cacheKey, JSON.stringify(forecast), {
        EX: 21600
      });

      res.status(200).json({
        success: true,
        data: forecast,
        cached: false
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch weather forecast" });
    }
  }
}

export const weatherController = new WeatherController();
