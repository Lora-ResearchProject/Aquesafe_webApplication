import axios from "axios";
import { baseURL } from "../config/config";
import { fetchVessels } from "./locationService";
import { getVesselsByZone } from "./zoneService";
import { getToken } from "../utils/auth";

const API_BASE_URL = baseURL + "/api/chat";

export const fetchLatestChats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    if (!response.ok) throw new Error("Failed to fetch latest chats");

    return await response.json();
  } catch (error) {
    console.error("Error fetching latest chats:", error);
    throw error;
  }
};

export const sendMessageToVessel = async (vesselId, messageNumber, message) => {
  try {
    await axios.post(
      `${API_BASE_URL}/`,
      {
        vesselId,
        messageNumber,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Include JWT token
        },
      }
    );
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

export const sendMessageToMultipleVessels = async (
  vesselIds,
  messageNumber,
  message
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/multiple`,
      {
        vesselIds,
        messageNumber,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Include JWT token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send messages to multiple vessels:", error);
    throw error;
  }
};

// Send message to all vessels
export const sendMessageToAllVessels = async (messageNumber, message) => {
  try {
    const vessels = await fetchLatestChats();
    const vesselIds = vessels.map((vessel) => vessel.vesselId);
    return await sendMessageToMultipleVessels(
      vesselIds,
      messageNumber,
      message
    );
  } catch (error) {
    console.error("Failed to send message to all vessels:", error);
    throw error;
  }
};

// Send message to all vessels in a specific zone
export const sendMessageToZone = async (zoneId, messageNumber, message) => {
  try {
    const vesselsInZone = await getVesselsByZone(zoneId);
    const vesselIds = vesselsInZone.map((vessel) => vessel.vesselId);
    return await sendMessageToMultipleVessels(
      vesselIds,
      messageNumber,
      message
    );
  } catch (error) {
    console.error("Failed to send message to zone:", error);
    throw error;
  }
};

export const fetchMessageOptions = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/messageData/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data.data; // Returning only the data array
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

export const fetchChatDataWithVessels = async () => {
  try {
    // Fetch vessels and chats in parallel
    const [vessels, chats] = await Promise.all([
      fetchVessels(),
      fetchLatestChats(),
    ]);

    // Create a mapping of vesselId → vesselName for quick lookup
    const vesselMap = vessels.reduce((map, vessel) => {
      map[vessel.vesselId] = vessel.vesselName;
      return map;
    }, {});

    // Merge chats with vessel names
    const chatData = chats.map((chat) => ({
      ...chat,
      vesselName: vesselMap[chat.vesselId] || "Unknown Vessel",
    }));

    return chatData;
  } catch (error) {
    console.error("Failed to fetch chat data:", error);
    throw error;
  }
};
