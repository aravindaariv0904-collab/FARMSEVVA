import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

class DiseaseService {
  async identifyDisease(userId, imageBase64) {
    const apiKey = process.env.PLANT_ID_API_KEY;
    const url = "https://plant.id/api/v3/identification";

    const payload = {
      images: [imageBase64],
      latitude: 11.1271, // Optional: add real GPS if available
      longitude: 78.6569,
      health: "all",
      similar_images: true
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.result;
      const isHealthy = result.is_healthy.probability > 0.5;
      
      const suggestions = result.disease.suggestions[0]; // Take top suggestion
      
      const report = await prisma.diseaseReport.create({
        data: {
          userId: userId,
          cropName: "Unknown", // Can be refined from Plant.id classification
          disease: isHealthy ? "Healthy" : suggestions.name,
          confidence: isHealthy ? result.is_healthy.probability : suggestions.probability,
          imageUrl: "stored_in_cloud_placeholder", // In prod, upload to S3 first
        }
      });

      return {
        id: report.id,
        isHealthy,
        diseaseName: isHealthy ? "No disease detected" : suggestions.name,
        confidence: (isHealthy ? result.is_healthy.probability : suggestions.probability) * 100,
        treatment: !isHealthy ? "Refer to local agriculture extension for treatment." : "Keep up the good maintenance."
      };
    } catch (error) {
      console.error("Plant.id API Error:", error.message);
      throw new Error("Disease identification failed. Check API key or image quality.");
    }
  }
}

export const diseaseService = new DiseaseService();
