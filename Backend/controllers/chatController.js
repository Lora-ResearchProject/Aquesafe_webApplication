const Chat = require("../models/chatModel");
const { sendToGateway } = require("../services/outgoingMessageService");
const { generateId } = require("../utils/idGenerator");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");
const { notifyClients } = require('../controllers/longPollController');

// Handle creating a new chat message
exports.createChat = async (req, res) => {
  try {
    const { vesselId, messageNumber, message } = req.body;

    // Validate required fields
    if (!vesselId || !messageNumber || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Create a new chat object (but don't save it yet)
    const newChat = new Chat({
      messageId: generateId(),
      vesselId,
      dateTime: new Date(),
      messageNumber,
      message,
      direction: "send",
    });

    // Prepare and format the outgoing message
    const formattedMessage = formatoutgoingMessage(
      {
        vesselId: newChat.vesselId,
        messageId: newChat.messageId,
        messageNumber: newChat.messageNumber,
      },
      "chat" // Type of message
    );

    // Define the external server URL dynamically (or use environment variable)
    const externalServerUrl = process.env.GATEWAY_API_URL;

    // Send the formatted data to the external server // -------------------------------------------------------------- need to uncomment this after fix this
    await sendToGateway(externalServerUrl, formattedMessage);

    // Save to the database only after successful external API call
    const savedChat = await newChat.save();

    notifyClients('chat');

    // Respond to the client with the saved chat
    res.status(201).json(savedChat);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to send data to external server or save chat." });
  }
};

// Handle retrieving chats
exports.getChats = async (req, res) => {
  try {
    const { vesselId } = req.params; // Get vessel ID from route parameters

    // Check if vesselId is provided
    if (!vesselId) {
      return res.status(400).json({ error: "Vessel ID is required." });
    }

    // Fetch chats filtered by vesselId and sorted by messageId in ascending order
    const chats = await Chat.find({ vesselId }).sort({ messageId: 1 });

    res.status(200).json(chats); // Return the chats
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve chats." });
  }
};

exports.getLatestChats = async (req, res) => {
  try {
    // Aggregate to get the latest message for each vessel
    const latestChats = await Chat.aggregate([
      {
        $sort: { dateTime: -1 }, // Sort by dateTime in descending order (latest first)
      },
      {
        $group: {
          _id: "$vesselId", // Group by vesselId
          latestMessage: { $first: "$$ROOT" }, // Get the first document (latest message)
        },
      },
      {
        $replaceRoot: { newRoot: "$latestMessage" }, // Replace the root with the latest message
      },
      {
        $sort: { dateTime: -1 }, // Sort the final result by dateTime (latest first)
      },
    ]);

    res.status(200).json(latestChats); // Return the sorted latest messages per vessel
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve latest chats per vessel." });
  }
};

exports.createChatsForMultipleVessels = async (req, res) => {
  try {
    const { vesselIds, messageNumber, message } = req.body;

    // Validate required fields
    if (!vesselIds || !Array.isArray(vesselIds) || vesselIds.length === 0) {
      return res.status(400).json({ error: "Vessel ID array is required." });
    }
    if (!messageNumber || !message) {
      return res
        .status(400)
        .json({ error: "Missing required message fields." });
    }

    const externalServerUrl = process.env.GATEWAY_API_URL; // External server URL

    // Create and send messages for each vessel
    const chatPromises = vesselIds.map(async (vesselId) => {
      try {
        const newChat = new Chat({
          messageId: generateId(),
          vesselId,
          dateTime: new Date(),
          messageNumber,
          message,
          direction: "send",
        });

        const formattedMessage = formatoutgoingMessage(
          {
            vesselId: newChat.vesselId,
            messageId: newChat.messageId,
            messageNumber: newChat.messageNumber,
          },
          "chat"
        );

        // Uncomment this after fixing the external API issue
        await sendToGateway(externalServerUrl, formattedMessage);

        const savedChat = await newChat.save();
        
        notifyClients('chat');

        // Save the chat to the database
        return savedChat;
      } catch (error) {
        console.error(`Failed to send message for vessel ${vesselId}:`, error);
        return { vesselId, error: error.message }; // Return error info for this vessel
      }
    });

    // Wait for all chat operations to complete
    const results = await Promise.all(chatPromises);

    // Separate successful and failed messages
    const successfulChats = results.filter((chat) => !chat.error);
    const failedChats = results.filter((chat) => chat.error);

    res.status(201).json({
      message: "Chat messages processed.",
      successfulChats,
      failedChats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send messages or save chats." });
  }
};
