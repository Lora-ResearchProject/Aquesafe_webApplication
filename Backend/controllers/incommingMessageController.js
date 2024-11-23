const VesselLocation = require("../models/vesselLocationModel");

// POST function to store vessel location data
const storeVesselLocation = async (req, res) => {
  try {
    const { id, l} = req.body;

    // Extract the vesselId and location parts
    const vesselId = id.split("-")[0]; // Get the first part of the id
    const [lat, lng] = l.split("-").map((coord) => parseFloat(coord)); // Split and parse lat, lng

    // Validate parsed values
    if (!vesselId || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Create a new vessel location document
    const vesselLocation = new VesselLocation({
      vesselId,
      dateTime: new Date(), // Use current date and time
      lat,
      lng,
    });

    // Save the document to the database
    await vesselLocation.save();

    res.status(201).json({ message: "Vessel location saved successfully" });
  } catch (error) {
    console.error("Error storing vessel location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  storeVesselLocation,
};
