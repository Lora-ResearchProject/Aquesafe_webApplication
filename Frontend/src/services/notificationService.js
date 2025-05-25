import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_BASE_URL = baseURL + "/api/notification";

// Fetch all notifications
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark a notification as read
export const markAsRead = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/read`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Fetch unread notifications
export const getUnreadNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/unread`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
};
