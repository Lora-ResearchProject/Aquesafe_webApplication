import { baseURL } from "../config/config";

const API_BASE_URL = baseURL + "/api/chat";

export const fetchLatestChats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error("Failed to fetch latest chats");

    return await response.json();
  } catch (error) {
    console.error("Error fetching latest chats:", error);
    throw error;
  }
};