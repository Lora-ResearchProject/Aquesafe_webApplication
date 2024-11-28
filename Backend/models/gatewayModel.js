const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema({
  gatewayId: { type: String, required: true, unique: true },
  gatewayName: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

module.exports = mongoose.model("Gateway", gatewaySchema);
