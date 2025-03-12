import axios from "axios";

import { baseURL } from "../config/config";

const API_URL = baseURL + "/api/zones";

// Fetch all zones
export const fetchZones = async () => {
  try {
    const response = await fetch(API_URL);
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
    });
    if (!response.ok) throw new Error("Failed to delete zone");
    return await response.json();
  } catch (error) {
    console.error("Error deleting zone:", error);
    throw error;
  }
};
