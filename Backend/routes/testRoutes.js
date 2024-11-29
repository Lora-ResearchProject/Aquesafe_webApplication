const express = require("express");
const router = express.Router();

// Combined controller and route for POST
router.post("/", async (req, res) => {
    try {
        // Log the data received in the request body
        const data = req.body;
        console.log("🚀 ~ Received data:", data);

        // Send a success response with the received data
        res.status(200).json({
            message: "Data received successfully.",
            receivedData: data,
        });
    } catch (error) {
        console.error("Error in test-post:", error.message);

        // Send an error response
        res.status(500).json({
            error: "Failed to handle POST request.",
        });
    }
});

module.exports = router;
