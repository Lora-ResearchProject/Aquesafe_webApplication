const axios = require("axios");

// Function to send data to another server
async function sendToGateway(url, data) {
    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Data sent successfully to external server:", response.data);
        return response.data; // Return response from the external server
    } catch (error) {
        console.error("Failed to send data to external server:", error.message);
        throw error; // Re-throw the error to handle it in the caller
    }
}

module.exports = { sendToGateway };
