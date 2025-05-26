const axios = require("axios");

// Function to send data to another server
async function sendToGateway(baseUrl, data, useStatusPath = false) {
  const endpoint = useStatusPath ? "/api/lora-status" : "/lora/sendChatData";
  const fullUrl = `${baseUrl.replace(/\/$/, "")}${endpoint}`;

  console.log("sendToGateway ~ fullUrl:", fullUrl);

  try {
    const response = await axios.post(fullUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Data sent successfully to external server");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    console.error("Failed to send data to external server:", message);
    throw new Error(message);
  }
}

module.exports = { sendToGateway };
