import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

class MarketService {
  async getLivePrices(crop, state, district) {
    // 1. Primary: Scrape Agmarknet
    // NOTE: Real Agmarknet scraping might require more state management (POST parameters)
    // Here we implement a structural crawler as requested.
    const agmarknetUrl = `https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=${crop}&Tx_State=${state}&Tx_District=${district}&Tx_Market=0&DateFrom=27-Mar-2026&DateTo=28-Mar-2026&Fr_Date=27-Mar-2026&To_Date=28-Mar-2026&Tx_Trend=0`;
    
    try {
      const response = await axios.get(agmarknetUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Parse the table rows (assuming standard Agmarknet result grid)
      let todayPrice = 0;
      let mandiName = "Unknown Mandi";
      
      $('#cphBody_GridPriceData tr').each((i, el) => {
        if (i === 1) { // Take the first result row
          mandiName = $(el).find('td').eq(1).text().trim();
          todayPrice = parseFloat($(el).find('td').eq(8).text().trim()); // Modal Price
        }
      });

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
