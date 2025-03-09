const axios = require("axios");
const { generateId } = require("../utils/idGenerator");
const { sendToGateway } = require("../services/outgoingMessageService");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");

// Function to fetch weather percentage
const getWeatherCheck = async (lat, lon) => {
  try {
    const apiUrl = process.env.WEATHER_API_URL;
    const response = await axios.get(`${apiUrl}/weather-check`, {
      params: { lat, lon },
    });

    // Extract the numeric value from the rain_percentage string (e.g., "10%" -> 10)
    const rainPercentage = response.data?.rain_percentage;
    if (rainPercentage) {
      const numericValue = rainPercentage.replace("%", ""); // Remove the '%' symbol
      return Number(numericValue); // Return as a number
    }

    return "Unknown"; // Default value if rain_percentage is not found
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return "Error retrieving data"; // Return error message in case of failure
  }
};

// Main function to process and send weather data
const processWeatherCheck = async (vesselId, lat, lon) => {
  try {
    // Fetch weather percentage
    const weatherPercentage = await getWeatherCheck(lat, lon);

    // Generate a unique messageId
    const messageId = generateId();

    if (weatherPercentage) {
      // Ensure the value is a valid number; if not, replace with 0
      const validWeatherPercentage = isNaN(weatherPercentage)
        ? 0
        : weatherPercentage;
    }

    // Prepare message data
    const msgData = {
      vesselId,
      messageId,
      weatherPercentage,
    };

    // Format the message
    const formattedMessage = formatoutgoingMessage(msgData, "weather");

    // Send the message to the gateway
    const gatewayUrl = process.env.GATEWAY_API_URL;
    // await sendToGateway(gatewayUrl, formattedMessage); // -------------------------------------------------------------- need to uncomment this after fix this

    console.log("Weather message sent successfully:", formattedMessage);
    return { success: true, message: "Weather data sent", data: msgData };
  } catch (error) {
    console.error("Error processing weather check:", error.message);
    return { success: false, error: "Failed to process weather data" };
  }
};

module.exports = {
  getWeatherCheck,
  processWeatherCheck,
};
