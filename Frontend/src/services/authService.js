import axios from "axios";
import { baseURL } from "../config/config";
import { getToken, saveToken } from "../utils/auth";

const API_BASE_URL = baseURL + "/api/users";

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    const { token } = response.data;
    saveToken(token);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Reset password
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, {
      resetToken,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch user details
export const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user details
export const updateUserDetails = async (name, email) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/profile`,
      { name, email },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Include JWT token
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Include JWT token
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, userData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include JWT token
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
