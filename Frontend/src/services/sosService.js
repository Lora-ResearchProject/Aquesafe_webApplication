import axios from "axios";
import { baseURL } from "../config/config";

const API_URL = baseURL + "/api/sos";

// Fetch all SOS data from the backend
export const fetchSOSData = async () => {
  try {
    const response = await axios.get(API_URL); // Replace with your backend endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching SOS data:", error);
    throw error;
  }
};

// Update SOS status in the backend
export const changeSOSStatus = async (id, sosStatus) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, { sosStatus }); // Replace with your backend endpoint
    return response.data;
  } catch (error) {
    console.error("Error updating SOS status:", error);
    throw error;
  }
};
