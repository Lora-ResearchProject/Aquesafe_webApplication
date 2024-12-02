const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  vesselId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  messageNumber: { type: Number, required: true },
  message: { type: String, required: true },
  direction: { type: String, enum: ['send', 'receive'], required: true },
});

module.exports = mongoose.model("Chat", chatSchema);
