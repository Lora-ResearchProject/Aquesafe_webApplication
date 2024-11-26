const VesselLocation = require("../models/vesselLocationModel");
const Sos = require("../models/sosModel");

// POST function to handle vessel location and SOS data
const storeVesselLocation = async (req, res) => {
  try {
    const { id, l, s } = req.body;

    // Extract the vesselId and location parts
    const vesselId = id.split("-")[0]; // Get the first part of the id
    const [lat, lng] = l.split("-").map((coord) => parseFloat(coord)); // Split and parse lat, lng

    // Validate parsed values
    if (!vesselId || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    if (s === 1) {
      // If 's' exists and is 1, save to the SOS model
      const sos = new Sos({
        vesselId,
        dateTime: new Date(), // Use current date and time
        lat,
        lng,
        sosStatus: "active", // Default SOS status as "active"
      });

      // Save the SOS document to the database
      await sos.save();

      return res.status(201).json({ message: "SOS data saved successfully" });
    } else {
      // Otherwise, save to the VesselLocation model
      const vesselLocation = new VesselLocation({
        vesselId,
        dateTime: new Date(), // Use current date and time
        lat,
        lng,
      });

      // Save the VesselLocation document to the database
      await vesselLocation.save();

      return res
        .status(201)
        .json({ message: "Vessel location saved successfully" });
    }
  } catch (error) {
    console.error("Error storing vessel location or SOS data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  storeVesselLocation,
};
