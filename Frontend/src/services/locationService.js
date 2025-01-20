import axios from "axios";
import { baseURL } from "../config/config";

const V_API_URL = baseURL + "/api/tracker";
const GW_API_URL = baseURL + "/api/gateway";

export const fetchLatestVesselLocations = async () => {
  try {
    const response = await axios.get(`${V_API_URL}/latestLocations`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching vessel locations:", {
      message: error.message,
      config: error.config, // Axios request configuration details
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : "No response received", // Log response details if available
    });

    throw error; // Rethrow error to handle it in the component
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


//---------- For testing purpose

export const getAllVesselLocationsdirect = async () => {
  try {
    const response = await axios.get("http://159.223.194.167:9002/get_all_vessel_locations");
    return response.data.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching all vessel locations:", {
      message: error.message,
      response: error.response ? error.response.data : "No response received",
    });
    throw error; // Rethrow error for handling elsewhere
  }
};

