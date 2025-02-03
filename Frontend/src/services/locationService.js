import axios from "axios";
import { format } from "date-fns";
import { baseURL } from "../config/config";

const V_API_URL = baseURL + "/api/tracker";
const GW_API_URL = baseURL + "/api/gateway";
const VESSEL_AUTH_URL = baseURL + "/api/vessel-auth";
const ROUTE_LOG_URL = baseURL + "/api/route-log";

export const fetchLatestVesselLocations = async () => {
  try {
    const response = await axios.get(`${V_API_URL}/latestLocations`);

    if (!response || response.status !== 200) {
      throw new Error("Failed to fetch vessel locations");
    }

    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching vessel locations:", {
      message: error.message,
      requestConfig: error.config, // Axios request configuration details
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : "No response received", // Log response details if available
    });

    throw new Error(`Error fetching vessel locations: ${error.message}`);
  }
};

export const fetchLatestGateWayLocations = async () => {
  try {
    const response = await axios.get(`${GW_API_URL}/`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching gateway locations:", error);
    throw error; // Rethrow error to handle it in the component
  }
};

// Fetch all vessels
export const fetchVessels = async () => {
  try {
    const response = await axios.get(`${VESSEL_AUTH_URL}/`);
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching vessels:", error);
    return [];
  }
};

// Fetch vessel locations by vesselId and date
export const fetchVesselLocations = async (vesselId, date) => {
  try {
    // Format the date before sending the request
    const formattedDate = format(new Date(date), "yyyy-MM-dd");

    const response = await axios.get(
      `${ROUTE_LOG_URL}/locationsByDate?vesselId=${vesselId}&date=${formattedDate}`
    );

    if (response.data.status === "success") {
      return { message: response.data.message, data: response.data.data };
    } else {
      console.log("No data found:", response.data.message);
      return { error: response.data.message, data: [] };
    }
  } catch (error) {
    console.error("Error fetching vessel locations:", error);

    // Extract error message from response if available
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch data. Please try again.";

    return { error: errorMessage, data: [] };
  }
};

//---------- For testing purpose

export const getAllVesselLocationsdirect = async () => {
  try {
    const response = await axios.get(
      "http://159.223.194.167:9002/get_all_vessel_locations"
    );
    return response.data.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching all vessel locations:", {
      message: error.message,
      response: error.response ? error.response.data : "No response received",
    });
    throw error; // Rethrow error for handling elsewhere
  }
};

export const getAllFishingHotspotsdirect = async () => {
  try {
    const response = await axios.get(
      "http://159.223.194.167:9002/suggest_fishing_hotspots"
    );
    return response.data.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching all vessel locations:", {
      message: error.message,
      response: error.response ? error.response.data : "No response received",
    });
    throw error; // Rethrow error for handling elsewhere
  }
};
