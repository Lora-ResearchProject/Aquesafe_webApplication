const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageNumber: { type: Number, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("Message", messageSchema);
