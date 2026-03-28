import { PrismaClient } from '@prisma/client';
import { marketService } from '../market/market.service.js';
import { weatherService } from '../weather/weather.service.js';
import { reverseGeocode } from '../../utils/geocoder.js';

const prisma = new PrismaClient();

const CROPS = [
  { name: "Rice", bhName: "వరి", season: "Kharif", minPh: 5.5, maxPh: 7.0, optN: 100, optP: 50, optK: 50, minRain: 1200, maxRain: 3000, minTemp: 20, maxTemp: 35, yield: "2.5 tons/acre", fertilizer: "100-50-50 NPK kg/acre" },
  { name: "Wheat", bhName: "గోధుమ", season: "Rabi", minPh: 6.0, maxPh: 7.5, optN: 120, optP: 60, optK: 40, minRain: 600, maxRain: 1000, minTemp: 10, maxTemp: 25, yield: "1.8 tons/acre", fertilizer: "120-60-40 NPK kg/acre" },
  { name: "Maize", bhName: "మొక్కజొన్న", season: "Kharif", minPh: 5.8, maxPh: 7.0, optN: 120, optP: 60, optK: 50, minRain: 500, maxRain: 1000, minTemp: 18, maxTemp: 32, yield: "2.0 tons/acre", fertilizer: "120-60-50 NPK kg/acre" },
  { name: "Cotton", bhName: "ప్రత్తి", season: "Kharif", minPh: 6.0, maxPh: 8.0, optN: 120, optP: 60, optK: 60, minRain: 500, maxRain: 1000, minTemp: 20, maxTemp: 35, yield: "1.5 tons/acre", fertilizer: "120-60-60 NPK kg/acre" },
  { name: "Sugarcane", bhName: "చెరకు", season: "Year-Round", minPh: 6.5, maxPh: 7.5, optN: 250, optP: 100, optK: 120, minRain: 1500, maxRain: 2500, minTemp: 20, maxTemp: 40, yield: "40 tons/acre", fertilizer: "250-100-120 NPK kg/acre" },
  { name: "Groundnut", bhName: "వేరుశనగ", season: "Kharif/Rabi", minPh: 6.0, maxPh: 6.5, optN: 20, optP: 40, optK: 30, minRain: 500, maxRain: 1000, minTemp: 20, maxTemp: 30, yield: "1.0 ton/acre", fertilizer: "20-40-30 NPK kg/acre" },
  { name: "Soybean", bhName: "సోయాబీన్", season: "Kharif", minPh: 6.0, maxPh: 6.8, optN: 30, optP: 80, optK: 40, minRain: 600, maxRain: 1000, minTemp: 20, maxTemp: 32, yield: "1.2 tons/acre", fertilizer: "30-80-40 NPK kg/acre" },
  { name: "Tomato", bhName: "టొమాటో", season: "Any", minPh: 6.0, maxPh: 7.0, optN: 150, optP: 100, optK: 100, minRain: 600, maxRain: 1000, minTemp: 15, maxTemp: 30, yield: "10 tons/acre", fertilizer: "150-100-100 NPK kg/acre" },
  { name: "Onion", bhName: "ఉల్లిపాయ", season: "Rabi", minPh: 6.0, maxPh: 7.5, optN: 100, optP: 50, optK: 80, minRain: 400, maxRain: 800, minTemp: 15, maxTemp: 30, yield: "8 tons/acre", fertilizer: "100-50-80 NPK kg/acre" },
  { name: "Chilli", bhName: "మిరప", season: "Kharif/Rabi", minPh: 6.0, maxPh: 7.0, optN: 100, optP: 60, optK: 60, minRain: 600, maxRain: 1200, minTemp: 20, maxTemp: 35, yield: "2 tons/acre", fertilizer: "100-60-60 NPK kg/acre" },
  { name: "Turmeric", bhName: "పసుపు", season: "Kharif", minPh: 5.5, maxPh: 7.5, optN: 120, optP: 100, optK: 150, minRain: 1500, maxRain: 2500, minTemp: 20, maxTemp: 35, yield: "4 tons/acre", fertilizer: "120-100-150 NPK kg/acre" },
  { name: "Banana", bhName: "అరటి", season: "Any", minPh: 6.5, maxPh: 7.5, optN: 200, optP: 100, optK: 300, minRain: 1000, maxRain: 2000, minTemp: 20, maxTemp: 35, yield: "15 tons/acre", fertilizer: "200-100-300 NPK kg/acre" },
  { name: "Mango", bhName: "మామిడి", season: "Perennial", minPh: 5.5, maxPh: 7.5, optN: 100, optP: 100, optK: 100, minRain: 1000, maxRain: 2000, minTemp: 25, maxTemp: 45, yield: "5 tons/acre", fertilizer: "Variable based on age" }
];

class CropRecommendationService {
  async getRecommendations(farmId) {
    // 1. Fetch Farm, Soil Profile, and Weather data
    const farm = await prisma.farm.findUnique({ 
      where: { id: farmId },
      include: { soilProfiles: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });

    if (!farm) throw new Error("Farm not found");
    const soil = farm.soilProfiles[0];
    if (!soil) return []; // No soil data

    // 2. Fetch Weather, Market and Geocode context
    const weather = await weatherService.getForecast(farm.gpsLat, farm.gpsLng);
    const geocode = await reverseGeocode(farm.gpsLat, farm.gpsLng);
    const state = geocode ? geocode.state : 'Unknown';

    const avgTemp = weather.daily.reduce((a, b) => a + b.temp_max, 0) / weather.daily.length;
    const totalRain = weather.daily.reduce((a, b) => a + b.rainfall_mm, 0);

    // 3. Scoring Matrix Implementation
    const recommendations = CROPS.map(crop => {
      let score = 0;
      let reasons = [];
      let riskWarning = false;

      // Soil pH Check (Score: 30)
      if (soil.phLevel >= crop.minPh && soil.phLevel <= crop.maxPh) {
        score += 30;
        reasons.push(`Soil pH (${soil.phLevel}) is excellent for ${crop.name}.`);
      } else if (Math.abs(soil.phLevel - (crop.minPh + crop.maxPh)/2) < 0.5) {
        score += 15;
        reasons.push(`Soil pH is marginally suitable.`);
      } else {
        riskWarning = true;
        reasons.push(`pH level is outside optimal range.`);
      }

      // Climatic Check (Score: 40)
      if (avgTemp >= crop.minTemp && avgTemp <= crop.maxTemp) {
        score += 20;
      } else {
        score += 5;
        reasons.push(`Average temperature (${avgTemp.toFixed(1)}°C) is sub-optimal.`);
      }

      if (totalRain * 30 >= crop.minRain / 4) { // Extrapolating 7-day rain to month
        score += 20;
      } else {
        riskWarning = true;
        reasons.push(`Low forecasted rainfall for this crop's needs.`);
      }

      // Nutrient Fit (Score: 20)
      if (soil.nitrogenLevel && crop.optN) {
        if (Math.abs(soil.nitrogenLevel - crop.optN) < 30) score += 20;
        else score += 10;
      }

      // Confidence level (estimate based on data points)
      const confidence = soil.confidencePct || 70;

      return {
        ...crop,
        score,
        reasoning: reasons,
        confidence,
        riskWarning
      };
    });

    // 4. Sorting and Formatting
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(rec => ({
        cropName: rec.name,
        localName: rec.bhName,
        score: rec.score,
        reasoning: rec.reasoning.join(" "),
        confidenceLevel: rec.confidence,
        riskWarning: rec.riskWarning,
        expectedYield: rec.yield,
        fertilizerDose: rec.fertilizer,
        optimalSowingDate: this.calculateSowingDate(rec.season, state)
      }));
  }

  calculateSowingDate(season, state) {
    if (state === "Tamil Nadu") {
      // TN specific calendar
      if (season === "Kharif") return "Adi Pattam (July - Aug)";
      if (season === "Rabi") return "Samba (Sep - Oct)";
      if (season === "Zaid") return "Kodai Pattam (Feb - Mar)";
    }

    if (season === "Kharif") return "June - July";
    if (season === "Rabi") return "October - November";
    return "Late February";
  }
}

export const cropRecommendationService = new CropRecommendationService();
