const Sos = require("../models/sosModel");
const Chat = require("../models/chatModel");
const MessageData = require("../models/messageDataModel");
const { createNotification } = require("./notificationController");
const { alertNearbyVessels } = require("../services/cerService");
const { processWeatherCheck } = require("../services/weatherService");

// POST function to handle SOS data and chat data
exports.storeVesselLocation = async (req, res) => {
  try {
    const { id, l, s, m, wr } = req.body; // Assuming wr is included in the request body
    const [vesselId, messageId] = id.split("|"); // Extract vesselId and messageId

    if (!vesselId || !messageId) {
      return res.status(400).json({ error: "Invalid vessel ID or Message ID" });
    }

    let lat = null,
      lng = null;

    // Parse latitude and longitude if available
    if (l) {
      const coords = l.split("|").map((coord) => parseFloat(coord));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        [lat, lng] = coords;
      }
    }

    // Handle Chat Message
    if (m) {
      const messageNumber = parseInt(m, 10);

      // Fetch the message using messageNumber
      const messageData = await MessageData.findOne({ messageNumber });

      if (!messageData) {
        return res
          .status(404)
          .json({ error: "Message not found for the given number" });
      }

      const chat = new Chat({
        messageId,
        vesselId,
        dateTime: new Date(),
        messageNumber,
        message: messageData.message,
        direction: "receive",
      });

      // Save chat data
      await chat.save();

      return res.status(201).json({ message: "Chat data saved successfully" });
    }

    // Handle SOS Alert
    if (Number(s) === 1) {
      // Alert nearby vessels and get the response message
      const alertResponse = await alertNearbyVessels(vesselId, lat, lng);
      const alertMessage = alertResponse.message;

      // Create SOS entry
      const sos = new Sos({
        vesselId,
        sosId: messageId,
        dateTime: new Date(),
        lat,
        lng,
        sosStatus: "active",
        alertMessage,
      });

      // Save the SOS record
      await sos.save();

      // Generate notification message
      const messageTitle = `SOS Alert from Vessel ${vesselId}`;
      const messageDescription = `An SOS has been triggered at coordinates (${lat}, ${lng}) on ${new Date().toLocaleString()}. Immediate action required!`;

      // Create notification
      await createNotification({
        messageTitle,
        messageDescription,
        Type: "sos",
      });

      return res.status(201).json({ message: "SOS data saved successfully" });
    }

    // Handle Weather Check (if wr is 1)
    if (Number(wr) === 1) {
      const result = await processWeatherCheck(
        vesselId,
        messageId,
        lat,
        lng,
        wr
      );
      return res
        .status(200)
        .json({
          message: "Weather check processed successfully",
          data: result.data,
        });
    }

    // Default response if no valid option is provided
    return res
      .status(400)
      .json({ error: "Invalid request, missing required fields." });
  } catch (error) {
    console.error(
      "Error storing vessel location, SOS data, or chat data:",
      error
    );
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
