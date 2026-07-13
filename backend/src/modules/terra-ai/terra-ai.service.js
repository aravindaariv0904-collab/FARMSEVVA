import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Optional Anthropic setup
let anthropic = null;
if (process.env.CLAUDE_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });
}

class TerraAIService {
  async getFarmerContext(userId) {
    try {
      const soil = await prisma.soilData.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const farm = await prisma.farm.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return { soil, farm };
    } catch (err) {
      console.warn("DB Context read error (using empty defaults):", err.message);
      return { soil: null, farm: null };
    }
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

    let reply = "";

    // 1. Try Gemini if API Key is configured
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("Calling Gemini API for Terra AI...");
        const contents = history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        }));
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else {
          console.error("Gemini API request failed:", await response.text());
        }
      } catch (gemErr) {
        console.error("Gemini API Error in Terra AI:", gemErr.message);
      }
    }

    // 2. Fallback to Claude if configured and Gemini didn't return
    if (!reply && anthropic) {
      try {
        console.log("Calling Claude API for Terra AI...");
        const response = await anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: message }
          ],
        });
        reply = response.content[0].text;
      } catch (claudeErr) {
        console.error("Claude API Error in Terra AI:", claudeErr.message);
      }
    }

    // 3. Fallback to local static mock answers if no keys exist (recruiter offline preview)
    if (!reply) {
      console.log("No AI API Keys found or active, loading local context-aware response...");
      if (message.toLowerCase().includes("soil") || message.toLowerCase().includes("mitti")) {
        reply = `Hello! Based on your location (${farm ? farm.location : 'India'}) and current season (${season}), we highly recommend scheduling a soil NPK test. Healthy crops start with balanced nutrients!`;
      } else {
        reply = `Hello! I am Terra AI. To give you the best agricultural recommendations, please input your farm location and soil pH values in the onboarding panel. Happy farming!`;
      }
    }

    // Save session to audit trail (if db is connected and model exists)
    try {
      await prisma.terraAISession.create({
        data: {
          farmerId: userId,
          message: message,
          response: reply,
          language: language,
          confidenceScore: confidenceScore,
        }
      });
    } catch (dbErr) {
      console.warn("Could not save Terra AI session audit trail to database:", dbErr.message);
    }

    return { reply, confidenceScore };
  }

  async getDailyUsage(userId) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      return await prisma.terraAISession.count({
        where: {
          farmerId: userId,
          createdAt: { gte: startOfDay }
        }
      });
    } catch (err) {
      return 0;
    }
  }
}

export const terraAIService = new TerraAIService();
