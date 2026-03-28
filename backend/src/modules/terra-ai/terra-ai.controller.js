import { terraAIService } from './terra-ai.service.js';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  language: z.enum(["English", "Hindi", "Telugu", "Tamil", "Kannada", "Marathi"]).default("English"),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional()
});

class TerraAIController {
  async chat(req, res) {
    const userId = req.user.userId;

    // 1. Validate Input
    const validation = ChatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, errors: validation.error.errors });
    }

    const { message, language, conversationHistory = [] } = validation.data;

    try {
      // 2. Check User Tier and Rate Limit
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      if (!user.isPremium) {
        const usageCount = await terraAIService.getDailyUsage(userId);
        if (usageCount >= 5) {
          return res.status(429).json({ 
            success: false, 
            message: "Daily limit reached for free tier (5/day). Upgrade to Premium for unlimited access.",
            upgradeRequired: true
          });
        }
      }

      // 3. Call Service
      const { reply, confidenceScore } = await terraAIService.callClaude(userId, message, language, conversationHistory);

      // 4. Return Response
      res.status(200).json({
        success: true,
        reply,
        confidenceScore
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error: Could not connect to Terra AI" });
    }
  }
}

export const terraAIController = new TerraAIController();
