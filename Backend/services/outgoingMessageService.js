const axios = require("axios");

// Function to send data to another server
async function sendToGateway(baseUrl, data, useStatusPath = false) {
  const endpoint = useStatusPath ? "/api/lora-status" : "/lora/sendChatData";
  const fullUrl = baseUrl + endpoint;

  try {
    const response = await axios.post(fullUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Data sent successfully to external server");
    return response.data;
  } catch (error) {
    console.error("Failed to send data to external server:", error.message);
    throw error;
  }
}

module.exports = { sendToGateway };
