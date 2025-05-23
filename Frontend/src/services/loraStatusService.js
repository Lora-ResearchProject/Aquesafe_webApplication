import axios from "axios";

import { baseURL } from "../config/config";

const API_URL = baseURL + "/api/pipeline/pipeline-status";

export const checkLoraStatus = async (testMessage) => {
  try {
    const response = await axios.post(API_URL, testMessage);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Unknown error occurred";

    return { error: message };
  }
};
