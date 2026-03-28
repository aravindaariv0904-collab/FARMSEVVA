import { soilService } from './soil.service.js';
import { connectRedis } from '../../utils/redis.js';

class SoilController {
  async autoFetch(req, res) {
    const { farmId } = req.query;

    if (!farmId) {
      return res.status(400).json({ success: false, message: "farmId is required" });
    }

    try {
      const redis = await connectRedis();
      const cacheKey = `soil_profile_${farmId}`;

      // 1. Try to fetch from Redis Cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`⚡ Serving soil profile from Redis cache for farmId: ${farmId}`);
        return res.status(200).json({
          success: true,
          data: JSON.parse(cached),
          cached: true
        });
      }

      // 2. Fetch from External APIs via Service
      const profile = await soilService.autoFetchSoil(farmId);

      // 3. Cache Result in Redis for 30 days (2,592,000 seconds)
      await redis.set(cacheKey, JSON.stringify(profile), {
        EX: 2592000
      });

      res.status(200).json({
        success: true,
        data: profile,
        cached: false
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message || "Failed to auto-fetch soil data" });
    }
  }
}

export const soilController = new SoilController();
