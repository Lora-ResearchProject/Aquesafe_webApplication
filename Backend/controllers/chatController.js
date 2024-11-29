const Chat = require("../models/chatModel");
const { sendToGateway } = require("../services/outGoingMessageService");
const { generateId } = require("../utils/idGenerator");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");


// Controller to handle creating a new chat message
exports.createChat = async (req, res) => {
    try {
        const { vessleId, messageNumber, message } = req.body;

        // Validate required fields
        if (!vessleId || !messageNumber || !message) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Create a new chat object
        const newChat = new Chat({
            messageId: generateId(),
            vessleId,
            dateTime: new Date(),
            messageNumber,
            message,
            direction: "send",
        });

        // Save to the database
        const savedChat = await newChat.save();

        // // Prepare and format the outgoing message
        // const formattedMessage = formatoutgoingMessage(
        //     {
        //         vessleId: savedChat.vessleId,
        //         messageId: savedChat.messageId,
        //         messageNumber: savedChat.messageNumber,
        //     },
        //     "chat" // Type of message
        // );

        // // Define the external server URL dynamically (or use environment variable)
        // const externalServerUrl = process.env.EXTERNAL_SERVER_URL;

        // // Send the formatted data to the external server
        // await sendToGateway(externalServerUrl, formattedMessage);

        // Respond to the client with the saved chat
        res.status(201).json(savedChat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save chat or send data to external server." });
    }
};

// Controller to handle retrieving chats
exports.getChats = async (req, res) => {
    try {
        const { vessleId } = req.params; // Get vessel ID from route parameters

        // Check if vessleId is provided
        if (!vessleId) {
            return res.status(400).json({ error: "Vessel ID is required." });
        }

        // Fetch chats filtered by vessleId and sorted by messageId in ascending order
        const chats = await Chat.find({ vessleId }).sort({ messageId: 1 });

        res.status(200).json(chats); // Return the chats
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve chats." });
    }
};

