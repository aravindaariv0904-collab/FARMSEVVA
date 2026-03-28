import { cropRecommendationService } from './crop.service.js';

class CropController {
  async recommend(req, res) {
    const { farmId } = req.query;

    if (!farmId) {
      return res.status(400).json({ success: false, message: "farmId is required" });
    }

    try {
      const recommendations = await cropRecommendationService.getRecommendations(farmId);
      
      res.status(200).json({
        success: true,
        recommendations,
        count: recommendations.length
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message || "Failed to generate crop recommendations" });
    }
  }
}

export const cropController = new CropController();
