const axios = require("axios");

// Service function to fetch all vessel locations from the external API
exports.fetchAllVesselLocations = async () => {
  try {
    const apiUrl = process.env.VESSEL_LOCATIONS_API_URL; // Get the URL from environment variables

    if (!apiUrl) {
      throw new Error("VESSEL_LOCATIONS_API_URL is not defined in the environment variables");
    }

    const apiResponse = await axios.get(apiUrl);

    if (apiResponse.status !== 200 || !apiResponse.data || apiResponse.data.status !== "success") {
      throw new Error("Failed to fetch data from external API");
    }

    if (!Array.isArray(apiResponse.data.data)) {
      throw new Error("Invalid data format received from API");
    }

    return apiResponse.data.data; // Return the data array
  } catch (error) {
    console.error("Error fetching data from external API:", {
      message: error.message,
      response: error.response ? error.response.data : "No response received",
    });

    throw new Error(`Error fetching data from external API: ${error.message}`);
  }
};