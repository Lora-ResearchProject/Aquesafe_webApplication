const { fetchAllVesselLocations } = require("../services/vesselLocationService");

// Controller function to get the latest location of each vessel
exports.getLatestVesselLocations = async (req, res) => {
  try {
    // Fetch all vessel data using the service function
    const allVesselData = await fetchAllVesselLocations();

    // Process the data to find the latest location for each vessel
    const latestLocations = Object.values(
      allVesselData.reduce((acc, location) => {
        const { vesselId, dateTime, lat, lng } = location;

        // If the vesselId is not in the accumulator or the current dateTime is newer, update it
        if (!acc[vesselId] || new Date(location.dateTime) > new Date(acc[vesselId].dateTime)) {
          acc[vesselId] = { vesselId, dateTime, lat, lng };
        }

        return acc;
      }, {})
    );

    res.status(200).json(latestLocations); // Send the result to the frontend
  } catch (error) {
    console.error("Error fetching latest vessel locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};