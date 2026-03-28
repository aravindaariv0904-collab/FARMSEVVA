import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export const validateSoilData = async (soilData, lat, lon) => {
  const prompt = `
    You are an expert soil scientist. Validate the following soil data for GPS coordinates (${lat}, ${lon}):
    - Soil Type: ${soilData.soilType}
    - pH: ${soilData.phLevel}
    - Nitrogen: ${soilData.nitrogenLevel} mg/kg
    - Phosphorus: ${soilData.phosphorusLevel} mg/kg
    - Potassium: ${soilData.potassiumLevel} mg/kg
    - Organic Carbon: ${soilData.organicCarbon}%

    Rules:
    1. pH outside 4.5–8.5 is rare and needs a warning.
    2. Impossible nutrient combinations (e.g., extremely high N with zero OC).
    3. Soil type mismatch for the geographical region (if known for these coordinates).

    Return ONLY a JSON array of warning strings if any issues are found, or an empty array [] if data looks plausible.
    Example: ["pH is critically low for this region", "Nitrogen levels are suspiciously high compared to organic carbon"]
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 512,
      system: "You are a soil validation assistant. Respond only with a JSON array of strings.",
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].text;
    return JSON.parse(content.match(/\[.*\]/s)[0] || "[]");
  } catch (error) {
    console.error("AI Validation Error:", error);
    return ["AI validation skipped due to technical error"];
  }
};
