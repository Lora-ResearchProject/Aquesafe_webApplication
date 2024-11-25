const mongoose = require("mongoose");

const messageDataSchema = new mongoose.Schema({
  messageNumber: { type: Number, required: true, unique: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("MessageData", messageDataSchema);
