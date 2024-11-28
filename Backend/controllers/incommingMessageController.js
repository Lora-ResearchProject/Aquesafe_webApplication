const VesselLocation = require("../models/vesselLocationModel");
const Sos = require("../models/sosModel");
const Chat = require("../models/chatModel");
const MessageData = require("../models/messageDataModel");

// POST function to handle vessel location, SOS data, and chat data
const storeVesselLocation = async (req, res) => {
  try {
    const { id, l, s, m } = req.body;

    // Extract the vesselId and messageId
    const [vesselId, messageId] = id.split("-"); // Split id into parts
    let lat, lng;

    if (l) {
      [lat, lng] = l.split("-").map((coord) => parseFloat(coord));
    }

    // Validate parsed values
    if (!vesselId) {
      return res.status(400).json({ error: "Invalid vessel Id" });
    }

    if (m) {
      // If 'm' exists, save data to the Chat model
      const messageNumber = parseInt(m, 10);

      // Fetch the message using messageNumber from MessageData
      const messageData = await MessageData.findOne({ messageNumber });

      if (!messageData) {
        return res
          .status(404)
          .json({ error: "Message not found for the given number" });
      }

      const chat = new Chat({
        messageId: messageId,
        vessleId: vesselId,
        dateTime: new Date(), // Use current date and time
        messageNumber,
        message: messageData.message,
      });

      // Save the Chat document to the database
      await chat.save();

      return res.status(201).json({ message: "Chat data saved successfully" });
    }

    if (s === 1) {
      // If 's' exists and is 1, save to the SOS model
      const sos = new Sos({
        vesselId,
        dateTime: new Date(), // Use current date and time
        lat,
        lng,
        sosStatus: "active", // Default SOS status as "active"
      });

      // Save the SOS document to the database
      await sos.save();

      return res.status(201).json({ message: "SOS data saved successfully" });
    } else {
      // Otherwise, save to the VesselLocation model
      const vesselLocation = new VesselLocation({
        vesselId,
        dateTime: new Date(), // Use current date and time
        lat,
        lng,
      });

      // Save the VesselLocation document to the database
      await vesselLocation.save();

      return res
        .status(201)
        .json({ message: "Vessel location saved successfully" });
    }
  } catch (error) {
    console.error(
      "Error storing vessel location, SOS data, or chat data:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  storeVesselLocation,
};
