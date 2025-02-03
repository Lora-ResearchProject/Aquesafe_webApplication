const axios = require("axios");

// Fetch all vessel locations from the external API
exports.fetchAllVesselLocations = async () => {
  try {
    const apiUrl = process.env.VESSEL_LOCATIONS_API_URL; // Get the URL from environment variables

    if (!apiUrl) {
      throw new Error(
        "VESSEL_LOCATIONS_API_URL is not defined in the environment variables"
      );
    }

    const apiResponse = await axios.get(`${apiUrl}/get_all_vessel_locations`);

    if (
      apiResponse.status !== 200 ||
      !apiResponse.data ||
      apiResponse.data.status !== "success"
    ) {
      throw new Error("Failed to fetch vessel location data from external API");
    }

    if (!Array.isArray(apiResponse.data.data)) {
      throw new Error("Invalid vessel location data format received from API");
    }

    return apiResponse.data.data; // Return the vessel data array
  } catch (error) {
    console.error("Error fetching vessel locations:", {
      message: error.message,
      response: error.response ? error.response.data : "No response received",
    });

    throw new Error(`Error fetching vessel locations: ${error.message}`);
  }
};

// Fetch suggested fishing hotspots from the external API
exports.suggestFishingHotspots = async () => {
  try {
    const apiUrl = process.env.VESSEL_LOCATIONS_API_URL; // Get the URL from environment variables

    if (!apiUrl) {
      throw new Error(
        "VESSEL_LOCATIONS_API_URL is not defined in the environment variables"
      );
    }

    const apiResponse = await axios.get(`${apiUrl}/suggest_fishing_hotspots`);

    if (
      apiResponse.status !== 200 ||
      !apiResponse.data ||
      apiResponse.data.status !== "success"
    ) {
      throw new Error("Failed to fetch fishing hotspot data from external API");
    }

    if (!Array.isArray(apiResponse.data.data)) {
      throw new Error("Invalid fishing hotspot data format received from API");
    }

    return apiResponse.data.data; // Return the hotspot data array
  } catch (error) {
    console.error("Error fetching fishing hotspots:", {
      message: error.message,
      response: error.response ? error.response.data : "No response received",
    });

    throw new Error(`Error fetching fishing hotspots: ${error.message}`);
  }
};
