const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  boundary: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  ], // Array of lat/lng pairs forming a polygon
});

module.exports = mongoose.model("Zone", ZoneSchema);