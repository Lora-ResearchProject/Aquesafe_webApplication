const Chat = require("../models/chatModel");
const {sendToGateway} = require("../services/outgoingMessageService");
const {generateId} = require("../utils/idGenerator");
const {formatoutgoingMessage} = require("../utils/outgoingMessageStructures");

// Handle creating a new chat message
exports.createChat = async (req, res) => {
  try {
    const {vessleId, messageNumber, message} = req.body;

    // Validate required fields
    if (!vessleId || !messageNumber || !message) {
      return res.status(400).json({error: "Missing required fields."});
    }

    // Create a new chat object (but don't save it yet)
    const newChat = new Chat({
      messageId: generateId(),
      vessleId,
      dateTime: new Date(),
      messageNumber,
      message,
      direction: "send",
    });

    // Prepare and format the outgoing message
    const formattedMessage = formatoutgoingMessage(
      {
        vessleId: newChat.vessleId,
        messageId: newChat.messageId,
        messageNumber: newChat.messageNumber,
      },
      "chat" // Type of message
    );

    // Define the external server URL dynamically (or use environment variable)
    const externalServerUrl = process.env.GATEWAY_API_URL;

    // Send the formatted data to the external server
    await sendToGateway(externalServerUrl, formattedMessage);

    // Save to the database only after successful external API call
    const savedChat = await newChat.save();

    // Respond to the client with the saved chat
    res.status(201).json(savedChat);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({error: "Failed to send data to external server or save chat."});
  }
};

// Handle retrieving chats
exports.getChats = async (req, res) => {
  try {
    const {vessleId} = req.params; // Get vessel ID from route parameters

    // Check if vessleId is provided
    if (!vessleId) {
      return res.status(400).json({error: "Vessel ID is required."});
    }

    // Fetch chats filtered by vessleId and sorted by messageId in ascending order
    const chats = await Chat.find({vessleId}).sort({messageId: 1});

    res.status(200).json(chats); // Return the chats
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to retrieve chats."});
  }
};
