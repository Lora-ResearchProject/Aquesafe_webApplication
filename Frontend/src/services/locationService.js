import axios from "axios";
import { baseURL } from "../config/config";

const V_API_URL = baseURL + "/api/tracker";
const GW_API_URL = baseURL + "/api/gateway";

export const fetchLatestVesselLocations = async () => {
  try {
    const response = await axios.get(`${V_API_URL}/latest-locations`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching vessel locations:", error);
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

