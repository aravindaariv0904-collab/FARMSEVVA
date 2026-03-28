import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

class MarketService {
  constructor() {
    this.resourceIdDaily = "35985678-0d79-46b4-9ed6-6f13308a1d24";
    this.resourceIdCurrent = "9ef84268-d588-465a-a308-a864a43d0070";
  }

  async getLivePrices(crop, state, district) {
    // 1. Primary: Official Data.gov.in API
    const baseUrl = `https://api.data.gov.in/resource/${this.resourceIdDaily}`;
    const apiKey = process.env.DATA_GOV_API_KEY;

    try {
      const apiResponse = await axios.get(baseUrl, {
        params: {
          'api-key': apiKey,
          'format': 'json',
          'filters[commodity]': crop,
          'filters[state]': state,
          'filters[district]': district,
          'limit': 10
        },
        timeout: 5000
      });

      let records = apiResponse.data.records || [];
      
      let todayPrice = 0;
      let mandiName = "Unknown Mandi";

      if (records.length === 0) {
        // Try secondary resource
        console.log("Searching secondary Data.gov.in resource...");
        const secondaryResponse = await axios.get(`https://api.data.gov.in/resource/${this.resourceIdCurrent}`, {
          params: { 'api-key': apiKey, 'format': 'json', 'filters[commodity]': crop, 'limit': 10 },
          timeout: 5000
        }).catch(() => null);
        records = secondaryResponse?.data?.records || [];
      }

      if (records.length > 0) {
        mandiName = records[0].market || records[0].market_name;
        todayPrice = parseFloat(records[0].modal_price || records[0].price);
      } else {
        // 2. Fallback: Scrape Agmarknet
        console.log("No records in Data.gov.in, attempting Agmarknet scraping...");
        const scrapeResult = await this.scrapeAgmarknet(crop, state, district);
        todayPrice = scrapeResult.todayPrice;
        mandiName = scrapeResult.mandiName;
      }

      // 2. Secondary: Mock eNAM API / Alternative
      const enamPrice = await this.fetchEnamPrice(crop, state);
      
      // Fallback if scraping fails
      if (!todayPrice) todayPrice = enamPrice;

      // 3. History Metrics (Fetch from DB or Cache)
      const history = await this.getMockHistory(todayPrice);
      const weekAvg = history.reduce((a, b) => a + b, 0) / 7;
      const monthAvg = history.reduce((a, b) => a + b, 0) / history.length;

      // 4. Flags and Advice
      const suspicious = Math.abs(todayPrice - weekAvg) / weekAvg > 0.3;
      const advice = todayPrice > weekAvg ? "Good time to sell" : "Wait for price recovery";

      return {
        todayPrice,
        weekAvg: parseFloat(weekAvg.toFixed(2)),
        monthAvg: parseFloat(monthAvg.toFixed(2)),
        priceHistory: history,
        nearestMandi: mandiName,
        sellTimingAdvice: advice,
        isSuspicious: suspicious
      };
    } catch (error) {
      console.error("Market Scraping Error:", error.message);
      throw new Error("Market data currently unavailable");
    }
  }

  async scrapeAgmarknet(crop, state, district) {
    const agmarknetUrl = `https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=${crop}&Tx_State=${state}&Tx_District=${district}&Tx_Market=0&Tx_Trend=0`;
    const response = await axios.get(agmarknetUrl, { timeout: 5000 }).catch(() => null);
    if (!response) return { todayPrice: 0, mandiName: "N/A" };

    const $ = cheerio.load(response.data);
    let todayPrice = 0;
    let mandiName = "N/A";
    
    $('#cphBody_GridPriceData tr').each((i, el) => {
      if (i === 1) {
        mandiName = $(el).find('td').eq(1).text().trim();
        todayPrice = parseFloat($(el).find('td').eq(8).text().trim());
      }
    });
    return { todayPrice, mandiName };
  }

  async fetchEnamPrice(crop, state) {
    // Call eNAM API (Placeholder)
    return 1800 + Math.random() * 200; // Mocked realistic base price
  }

  async getMockHistory(current) {
    // In production, fetch from MarketPrice table
    const history = [];
    for (let i = 0; i < 30; i++) {
      history.push(current - (Math.random() * 100) + 50);
    }
    return history;
  }
}

export const marketService = new MarketService();
