// Import axios (make sure it's installed: npm install axios)
import axios from 'axios'

// Main function to get location based on IP
const getLocationFromIP = async () => {
  try {
    const response = await axios.get('http://ip-api.com/json/');
    const data = response.data;
    console.log(data);

    if (data.status === 'success') {
      const { city, regionName, country, lat, lon, query: ip } = data;

      console.log('📍 Approximate Location Found:');
      console.log(`IP Address: ${ip}`);
      console.log(`City: ${city}`);
      console.log(`Region: ${regionName}`);
      console.log(`Country: ${country}`);
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);
    } else {
      throw new Error('Failed to get location');
    }
  } catch (error) {
    console.error('❌ Error fetching location data:', error.message);
  }
};

// Run it
getLocationFromIP();
