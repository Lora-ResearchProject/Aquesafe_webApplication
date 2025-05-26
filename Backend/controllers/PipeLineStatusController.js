const { sendToGateway } = require("../services/outgoingMessageService");

exports.forwardLoraStatus = async (req, res) => {
  const externalServerUrl = process.env.GATEWAY_API_URL; // External server URL
  const payload = req.body;

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const response = await sendToGateway(externalServerUrl, payload, true);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error forwarding to external server:", error.message);
    res.status(500).json({ error: "Failed to forward request" });
  }
};
