const Sos = require("../models/sosModel");
const Chat = require("../models/chatModel");
const MessageData = require("../models/messageDataModel");
const { createNotification } = require("./notificationController");
const { alertNearbyVessels } = require("../services/cerService");

// POST function to handle SOS data and chat data
exports.storeVesselLocation = async (req, res) => {
  try {
    const { id, l, s, m } = req.body;
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
      const sos = new Sos({
        vesselId,
        sosId: messageId,
        dateTime: new Date(),
        lat,
        lng,
        sosStatus: "active",
      });

      // Save SOS data
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

      await alertNearbyVessels(vesselId, lat, lng);

      return res.status(201).json({ message: "SOS data saved successfully" });
    }

    return res
      .status(400)
      .json({ error: "Invalid request, missing required fields." });
  } catch (error) {
    console.error(
      "Error storing vessel location, SOS data, or chat data:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
