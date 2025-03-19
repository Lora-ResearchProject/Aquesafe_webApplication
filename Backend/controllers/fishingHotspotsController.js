const { suggestFishingHotspots } = require("../services/vesselLocationService");

// Get suggested fishing hotspots with optional query parameters
exports.getFishingHotspots = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { period, start_date, end_date } = req.query;

    // Prepare query parameters object
    const queryParams = {};
    if (period) {
      queryParams.period = period;
    } else if (start_date && end_date) {
      queryParams.start_date = start_date;
      queryParams.end_date = end_date;
    }

    // Fetch fishing hotspot data using the service function with query parameters
    const hotspots = await suggestFishingHotspots(queryParams);

    // If no hotspots are found, return a 200 with an empty array and a message
    if (!Array.isArray(hotspots) || hotspots.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No fishing hotspots found",
        data: [],
      });
    }

    // If hotspots are found, return them with a 200 status
    res.status(200).json({
      status: "success",
      message: "Fishing hotspot data retrieved successfully",
      data: hotspots,
    });
  } catch (error) {
    console.error("Error fetching fishing hotspots:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
