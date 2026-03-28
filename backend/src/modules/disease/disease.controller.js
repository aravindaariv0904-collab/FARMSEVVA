import { diseaseService } from './disease.service.js';

class DiseaseController {
  async identify(req, res) {
    const { image } = req.body; // Expect base64
    const userId = req.user.userId;

    if (!image) {
      return res.status(400).json({ success: false, message: "Image base64 data is required" });
    }

    try {
      const result = await diseaseService.identifyDisease(userId, image);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message || "Disease identification failed" });
    }
  }
}

export const diseaseController = new DiseaseController();
