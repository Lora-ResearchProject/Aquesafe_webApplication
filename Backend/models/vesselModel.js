const mongoose = require("mongoose");

const vesselSchema = new mongoose.Schema({
  vesselId: { type: String, required: true, unique: true },
  vesselName: { type: String, required: true },
});

module.exports = mongoose.model("Vessle", vesselSchema);
