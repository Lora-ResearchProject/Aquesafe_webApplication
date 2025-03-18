const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    messageTitle: { type: String, required: true },
    messageDescription: { type: String, required: true },
    Type: {
      type: String,
      enum: ["sos", "chat", "danger", "other"],
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
