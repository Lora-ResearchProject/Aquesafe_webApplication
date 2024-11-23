const mongoose = require("mongoose");

const vesselLocationSchema = new mongoose.Schema({
  vesselId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

module.exports = mongoose.model("VesselLocation", vesselLocationSchema);
