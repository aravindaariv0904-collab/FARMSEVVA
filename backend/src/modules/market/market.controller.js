import { marketService } from './market.service.js';
import { connectRedis } from '../../utils/redis.js';

class MarketController {
  async getPrices(req, res) {
    const { crop, state, district } = req.query;

    if (!crop || !state || !district) {
      return res.status(400).json({ success: false, message: "Crop, state, and district are required" });
    }

    try {
      const redis = await connectRedis();
      const cacheKey = `market_prices_${crop}_${state}_${district}`;

      // 1. Check Redis Cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`📈 Serving market prices from Redis cache for: ${crop} in ${district}, ${state}`);
        return res.status(200).json({
          success: true,
          data: JSON.parse(cached),
          cached: true
        });
      }

      // 2. Call Service
      const prices = await marketService.getLivePrices(crop, state, district);

      // 3. Cache Result in Redis for 1 hour (3600 seconds)
      await redis.set(cacheKey, JSON.stringify(prices), {
        EX: 3600
      });

      res.status(200).json({
        success: true,
        data: prices,
        cached: false
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch market data" });
    }
  }
}

export const marketController = new MarketController();
