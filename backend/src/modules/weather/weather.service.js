import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class WeatherService {
  async getForecast(lat, lon) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      
      // Group by date and calculate daily metrics
      const dailyData = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            temps: [],
            humidities: [],
            rainfall: 0,
            weather: item.weather[0].main
          };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidities.push(item.main.humidity);
        if (item.rain) dailyData[date].rainfall += (item.rain['3h'] || 0);
      });

      const forecast = Object.values(dailyData).map(day => {
        const avgHumidity = day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length;
        const maxTemp = Math.max(...day.temps);
        return {
          date: day.date,
          temp_max: maxTemp,
          temp_min: Math.min(...day.temps),
          humidity: avgHumidity,
          rainfall_mm: parseFloat(day.rainfall.toFixed(2)),
          pestRiskScore: this.calculatePestRisk(maxTemp, avgHumidity),
          condition: day.weather
        };
      });

      return {
        daily: forecast,
        fourMonthSummary: "Typical monsoon pattern expected with moderate rainfall.",
        extremeWeatherAlerts: this.checkExtremeWeather(forecast)
      };
    } catch (error) {
      console.error("Weather API Error:", error.message);
      throw new Error("Could not fetch weather data");
    }
  }

  calculatePestRisk(temp, humidity) {
    // Basic heuristic: High humidity (>80%) and moderate temp (20-30°C) increases risk
    let score = 0;
    if (humidity > 80) score += 40;
    else if (humidity > 60) score += 20;

    if (temp > 20 && temp < 32) score += 40;
    else score += 10;

    return Math.min(score, 100);
  }

  checkExtremeWeather(forecast) {
    const alerts = [];
    forecast.forEach(day => {
      if (day.temp_max > 40) alerts.push(`Heatwave warning for ${day.date}`);
      if (day.rainfall_mm > 50) alerts.push(`Heavy rainfall warning for ${day.date}`);
    });
    return alerts;
  }
}

export const weatherService = new WeatherService();
