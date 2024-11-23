const VesselLocation = require("../models/vesselLocationModel");

// Controller function to get the latest location of each vessel
const getLatestVesselLocations = async (req, res) => {
  try {
    // Use aggregation to group by vesselId and get the latest entry
    const latestLocations = await VesselLocation.aggregate([
      {
        $sort: { dateTime: -1 }, // Sort by dateTime in descending order
      },
      {
        $group: {
          _id: "$vesselId", // Group by vesselId
          vesselId: { $first: "$vesselId" }, // Keep vesselId
          dateTime: { $first: "$dateTime" }, // Get the latest dateTime
          lat: { $first: "$lat" }, // Get the latest lat
          lng: { $first: "$lng" }, // Get the latest lng
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default `_id` field
          vesselId: 1,
          dateTime: 1,
          lat: 1,
          lng: 1,
        },
      },
    ]);

    res.status(200).json(latestLocations); // Send the result to the frontend
  } catch (error) {
    console.error("Error fetching latest vessel locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getLatestVesselLocations,
};
