import axios from "axios";
import { baseURL } from "../config/config";
import { fetchVessels } from "./locationService";

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

export const fetchEnhancedSOSData = async () => {
  try {
    // Fetch vessels and SOS data in parallel
    const [vessels, sosData] = await Promise.all([
      fetchVessels(),
      fetchSOSData(),
    ]);

    // Create a mapping of vesselId → vesselName for quick lookup
    const vesselMap = vessels.reduce((map, vessel) => {
      map[vessel.vesselId] = vessel.vesselName;
      return map;
    }, {});

    // Merge SOS data with vessel names
    const sosDataWithVesselNames = sosData.map((sos) => ({
      ...sos,
      vesselName: vesselMap[sos.vesselId] || "Unknown Vessel",
    }));

    return sosDataWithVesselNames;
  } catch (error) {
    console.error("Error fetching enhanced SOS data:", error);
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
