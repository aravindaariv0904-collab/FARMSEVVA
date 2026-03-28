import axios from 'axios';

/**
 * Reverse geocode lat/lon to get state/district using Nominatim (Free)
 */
export const reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'FarmSeeva/1.0' // Nominatim requires a user agent
      },
      timeout: 5000
    });

    const address = response.data.address;
    return {
      state: address.state || address.region,
      district: address.county || address.district || address.city_district || address.suburb,
      city: address.city || address.town || address.village,
      country: address.country
    };
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    return null;
  }
};
