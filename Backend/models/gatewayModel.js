const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema({
  gatewayId: { type: String, required: true, unique: true },
  gatewayName: { type: String, required: true },
});

module.exports = mongoose.model("Gateway", gatewaySchema);
