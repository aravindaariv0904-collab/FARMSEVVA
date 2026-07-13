import { jest } from '@jest/globals';
import { terraAIService } from '../modules/terra-ai/terra-ai.service.js';

describe('TerraAIService Fallbacks', () => {
  beforeEach(() => {
    // Clear any configured API keys from environment to test local mock fallbacks
    delete process.env.GEMINI_API_KEY;
    delete process.env.CLAUDE_API_KEY;
  });

  it('should fall back to local mock response for soil questions', async () => {
    const userId = "test-user-123";
    const result = await terraAIService.callClaude(userId, "How is my soil pH?", "en");
    
    expect(result).toHaveProperty('reply');
    expect(result.reply).toContain('soil NPK test');
    expect(result).toHaveProperty('confidenceScore');
  });

  it('should fall back to local mock response for other questions', async () => {
    const userId = "test-user-123";
    const result = await terraAIService.callClaude(userId, "Hello assistant", "en");
    
    expect(result).toHaveProperty('reply');
    expect(result.reply).toContain('I am Terra AI');
  });
});
