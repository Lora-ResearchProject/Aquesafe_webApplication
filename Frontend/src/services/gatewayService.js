import { baseURL } from "../config/config";

const API_BASE_URL = baseURL + "/api/gateway";

export const fetchGateways = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error("Failed to fetch gateways");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching gateways:", error);
    throw error;
  }
};
