import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { validateSoilData } from '../../utils/ai-validator.js';

const prisma = new PrismaClient();

class SoilService {
  async fetchFromSoilGrids(lat, lon) {
    const baseUrl = "https://rest.isric.org/soilgrids/v2.0/properties/query";
    const params = {
      lon, lat,
      property: ['phh2o', 'nitrogen', 'soc', 'clay', 'sand', 'silt', 'cec'],
      depth: '0-30cm',
      value: 'mean'
    };

    try {
      const response = await axios.get(baseUrl, { params, timeout: 5000 });
      const layers = response.data.properties.layers;
      
      const getVal = (name) => {
        const layer = layers.find(l => l.name === name);
        if (!layer) return null;
        const mean = layer.depths[0].values.mean;
        // Conversion logic (based on ISRIC units)
        if (name === 'phh2o') return mean / 10; // pH*10 -> pH
        if (name === 'nitrogen') return mean / 100; // cg/kg -> g/kg
        if (name === 'soc') return mean / 10; // dg/kg -> g/kg
        return mean;
      };

      return {
        ph: getVal('phh2o'),
        nitrogen: getVal('nitrogen'),
        soc: getVal('soc'),
        clay: getVal('clay'),
        sand: getVal('sand'),
        silt: getVal('silt'),
        cec: getVal('cec'),
        confidence: 85, // Standard SoilGrids confidence
        source: 'SoilGrids (ISRIC)'
      };
    } catch (error) {
      console.error("SoilGrids Error:", error.message);
      return null;
    }
  }

  async fetchFromBhuvan(lat, lon) {
    // Placeholder logic for ISRO Bhuvan (WMS/WFS based thematic service)
    // In a real scenario, this would be a GetFeatureInfo OGC call.
    try {
      // Mocked response for demonstration (matching typical Bhuvan soil layer info)
      return {
        soilType: "Alluvial", // Example
        confidence: 90,
        source: 'ISRO Bhuvan'
      };
    } catch (e) {
      return null;
    }
  }

  async fetchFromOpenLandMap(lat, lon) {
    // Fallback source implementation
    try {
      return {
        ph: 6.8, // Example fallback data (mocked)
        nitrogen: 1.2,
        confidence: 60,
        source: 'OpenLandMap'
      };
    } catch (e) {
      return null;
    }
  }

  mergeResults(results) {
    const merged = {
      soilType: "Unknown",
      phLevel: null,
      nitrogenLevel: null,
      phosphorusLevel: null, // Often missing in global satellite APIs
      potassiumLevel: null,  // Often missing in global satellite APIs
      zincLevel: null,
      organicCarbon: null,
      clay: null,
      sand: null,
      silt: null,
      cec: null,
      confidencePct: 0,
      source: "Multi-Source Fetch"
    };

    // Sorting by confidence (actually we should take specific values if high confidence)
    results.forEach(res => {
      if (!res) return;
      if (res.soilType && (!merged.soilType || merged.confidencePct < res.confidence)) {
        merged.soilType = res.soilType;
      }
      if (res.ph && (!merged.phLevel || (res.confidence > 70))) merged.phLevel = res.ph;
      if (res.nitrogen) merged.nitrogenLevel = res.nitrogen;
      if (res.soc) merged.organicCarbon = res.soc;
      if (res.clay) merged.clay = res.clay;
      if (res.sand) merged.sand = res.sand;
      if (res.silt) merged.silt = res.silt;
      if (res.cec) merged.cec = res.cec;
      
      merged.confidencePct = Math.max(merged.confidencePct, res.confidence);
    });

    return merged;
  }

  async autoFetchSoil(farmId) {
    // 1. Get Farm Coords
    const farm = await prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm || !farm.gpsLat || !farm.gpsLng) {
      throw new Error("Farm not found or missing GPS coordinates");
    }

    const { gpsLat, gpsLng } = farm;

    // 2. Fetch API Data in Parallel
    const settled = await Promise.allSettled([
      this.fetchFromSoilGrids(gpsLat, gpsLng),
      this.fetchFromBhuvan(gpsLat, gpsLng),
      this.fetchFromOpenLandMap(gpsLat, gpsLng)
    ]);

    const results = settled
      .filter(s => s.status === 'fulfilled')
      .map(s => s.value);

    // 3. Merge and Populate Missing Values
    const soilData = this.mergeResults(results);
    soilData.lat = gpsLat;
    soilData.lon = gpsLng;

    // 4. AI Validation Check
    const warnings = await validateSoilData(soilData, gpsLat, gpsLng);
    soilData.validationWarnings = JSON.stringify(warnings);

    // 5. Save to Soil Profile
    const profile = await prisma.soilProfile.create({
      data: {
        userId: farm.userId,
        farmId: farm.id,
        soilType: soilData.soilType,
        phLevel: soilData.phLevel,
        nitrogenLevel: soilData.nitrogenLevel,
        phosphorusLevel: soilData.phosphorusLevel,
        potassiumLevel: soilData.potassiumLevel,
        zincLevel: soilData.zincLevel,
        organicCarbon: soilData.organicCarbon,
        clay: soilData.clay,
        sand: soilData.sand,
        silt: soilData.silt,
        cec: soilData.cec,
        confidencePct: soilData.confidencePct,
        source: soilData.source,
        method: 'gps_auto',
        validationWarnings: soilData.validationWarnings,
        lat: gpsLat,
        lon: gpsLng
      }
    });

    return profile;
  }
}

export const soilService = new SoilService();
