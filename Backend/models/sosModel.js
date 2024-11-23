const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  vesselId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  sosStatus: { type: String, enum: ["active", "resolved"], required: true },
});

module.exports = mongoose.model("SOS", sosSchema);
