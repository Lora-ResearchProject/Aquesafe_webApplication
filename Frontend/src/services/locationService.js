import axios from "axios";

const API_URL = "http://localhost:3001/api/tracker";

export const fetchLatestVesselLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/latest-locations`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching vessel locations:", error);
    throw error; // Rethrow error to handle it in the component
  }
};
