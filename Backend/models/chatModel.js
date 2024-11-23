const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  vessleId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  messageNumber: { type: Number, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("Chat", chatSchema);
