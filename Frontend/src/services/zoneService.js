import axios from "axios";
import { baseURL } from "../config/config";
import { fetchVessels } from "./locationService";
import { getToken } from "../utils/auth";

const API_URL = baseURL + "/api/zones";

// Fetch all zones
export const fetchZones = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    if (!response.ok) throw new Error("Failed to fetch zones");
    return await response.json();
  } catch (error) {
    console.error("Error fetching zones:", error);
    throw error;
  }
};

// Create a new zone
export const createZone = async (zoneData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(zoneData),
    });
    if (!response.ok) throw new Error("Failed to create zone");
    return await response.json();
  } catch (error) {
    console.error("Error creating zone:", error);
    throw error;
  }
};

// Update a zone
export const updateZone = async (zoneId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${zoneId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Failed to update zone");
    return await response.json();
  } catch (error) {
    console.error("Error updating zone:", error);
    throw error;
  }
};

// Delete a zone
export const deleteZone = async (zoneId) => {
  try {
    const response = await fetch(`${API_URL}/${zoneId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to delete zone");
    return await response.json();
  } catch (error) {
    console.error("Error deleting zone:", error);
    throw error;
  }
};

export const getVesselsByZone = async (zoneId) => {
  try {
    // Fetch vessels for the specified zone
    const response = await axios.get(`${API_URL}/vessels/${zoneId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    const zoneVessels = response.data;

    // Fetch all vessels to get vessel names
    const allVessels = await fetchVessels();

    // Create a map of vesselId to vesselName for quick lookup
    const vesselMap = new Map();
    allVessels.forEach((vessel) => {
      vesselMap.set(vessel.vesselId, vessel.vesselName);
    });

    // Add vesselName to each vessel in zoneVessels
    const vesselsWithNames = zoneVessels.map((vessel) => ({
      ...vessel,
      vesselName: vesselMap.get(vessel.vesselId) || "Unknown Vessel", // Fallback in case vesselId is not found
    }));

    return vesselsWithNames;
  } catch (error) {
    console.error(`Error fetching vessels for zone ${zoneId}:`, error);
    throw new Error(
      "Unable to fetch vessels. Please check your network and try again."
    );
  }
};
