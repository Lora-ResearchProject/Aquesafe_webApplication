const MessageData = require("../models/messageDataModel");

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { messageNumber, message } = req.body;
    const newMessage = new MessageData({ messageNumber, message });
    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await MessageData.find();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await MessageData.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const { messageNumber, message } = req.body;
    const updatedMessage = await MessageData.findByIdAndUpdate(
      req.params.id,
      { messageNumber, message },
      { new: true, runValidators: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await MessageData.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
