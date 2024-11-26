import axios from "axios";
import { baseURL } from "../config/config";

const API_URL = baseURL + "/api/tracker";

export const fetchLatestVesselLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/latest-locations`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching vessel locations:", error);
    throw error; // Rethrow error to handle it in the component
  }
};
