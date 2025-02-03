const { fetchAllVesselLocations } = require("../services/vesselLocationService");

// Controller function to get the latest location of each vessel
exports.getLatestVesselLocations = async (req, res) => {
  try {
    // Fetch all vessel data using the service function
    const allVesselData = await fetchAllVesselLocations();

    if (!Array.isArray(allVesselData) || allVesselData.length === 0) {
      return res.status(404).json({ message: "No vessel location data available." });
    }

    // Process the data to find the latest location for each vessel
    const latestLocations = Object.values(
      allVesselData.reduce((acc, location) => {
        const { vesselId, dateTime, lat, lng } = location;
        const currentDateTime = new Date(dateTime);

        // If the vesselId is not in the accumulator or the current dateTime is newer, update it
        if (!acc[vesselId] || currentDateTime > new Date(acc[vesselId].dateTime)) {
          acc[vesselId] = { vesselId, dateTime, lat, lng };
        }

        return acc;
      }, {})
    );

    res.status(200).json(latestLocations); // Send the result to the frontend
  } catch (error) {
    console.error("Error fetching latest vessel locations:", error.message);
    res.status(500).json({ error: error.message || "Internal server error." });
  }
};