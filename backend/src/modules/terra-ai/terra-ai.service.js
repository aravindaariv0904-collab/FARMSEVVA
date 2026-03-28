import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

class TerraAIService {
  async getFarmerContext(userId) {
    const soil = await prisma.soilData.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const farm = await prisma.farm.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return { soil, farm };
  }

  getSeason() {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 6 && month <= 10) return "Kharif (Monsoon)";
    if (month >= 11 || month <= 2) return "Rabi (Winter)";
    return "Zaid (Summer)";
  }

  async callClaude(userId, message, language, history = []) {
    const { soil, farm } = await this.getFarmerContext(userId);
    const season = this.getSeason();

    // Data completeness estimate for confidence score
    let dataPoints = 0;
    if (soil) dataPoints += 4; // N, P, K, pH
    if (farm) dataPoints += 1; // Location
    const confidenceScore = Math.min((dataPoints / 5) * 100, 95); // Max 95% if data exists

    const systemPrompt = `
      You are Terra AI, an expert agricultural assistant for Indian farmers.
      Your goal is to provide precise, data-driven advice on crops, soil health, and farming techniques.

      FARMER PROFILE:
      - Location: ${farm ? farm.location : 'Unknown'}
      - Current Season: ${season}
      ${soil ? `- Soil Data: pH ${soil.ph}, Nitrogen ${soil.nitrogen}, Phosphorus ${soil.phosphorus}, Potassium ${soil.potassium}` : '- Soil Data: Not available yet'}
      - User Language Preference: ${language}

      GUIDELINES:
      - ALWAYS respond in the language used by the farmer: ${language}.
      - Use cultural context relevant to Indian agriculture.
      - If soil data is missing, suggest getting a soil test.
      - Keep advice practical, low-cost, and sustainable.
      - Include confidence level in your reasoning internally.
    `;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: message }
        ],
      });

      const reply = response.content[0].text;

      // Save to audit trail
      await prisma.terraAISession.create({
        data: {
          farmerId: userId,
          message: message,
          response: reply,
          language: language,
          confidenceScore: confidenceScore,
        }
      });

      return { reply, confidenceScore };
    } catch (error) {
      console.error("Claude API Error:", error);
      throw new Error("Failed to communicate with Terra AI");
    }
  }

  async getDailyUsage(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await prisma.terraAISession.count({
      where: {
        farmerId: userId,
        createdAt: { gte: startOfDay }
      }
    });
  }
}

export const terraAIService = new TerraAIService();
