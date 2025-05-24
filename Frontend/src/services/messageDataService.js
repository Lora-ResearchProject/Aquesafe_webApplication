import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_BASE_URL = baseURL + "/api/messageData";

// Fetch all messages
export const fetchMessages = async () => {
  const response = await axios.get(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include JWT token
    },
  });
  return response.data.data;
};

// Add a new message
export const addMessage = async (message) => {
  const response = await axios.post(API_BASE_URL, message, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include JWT token
    },
  });
  return response.data.data;
};

// Update an existing message
export const updateMessage = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include JWT token
    },
  });
  return response.data.data;
};

// Delete a message
export const deleteMessage = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include JWT token
    },
  });
};
