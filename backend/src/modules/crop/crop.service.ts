export class CropService {
  async recommendCrops(ph: number, n: number, p: number, k: number) {
    const recommendations: string[] = [];

    // Rule-based logic from requirements
    if (ph >= 6 && ph <= 7.5) {
      recommendations.push("Rice", "Wheat");
    } else if (ph > 7.5) {
      recommendations.push("Cotton", "Barley");
    } else if (ph < 6) {
      recommendations.push("Potato", "Tea");
    }

    // High nutrient rules (assuming 'high' means > 50 units for simplicity)
    if (n > 50) {
      recommendations.push("Maize");
    }
    if (p > 30) {
      recommendations.push("Sugarcane");
    }
    if (k > 40) {
      recommendations.push("Banana");
    }

    // Return unique set of recommendations
    return [...new Set(recommendations)];
  }
}

export const cropService = new CropService();
