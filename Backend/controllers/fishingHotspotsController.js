const { suggestFishingHotspots } = require("../services/vesselLocationService");

// Get suggested fishing hotspots
exports.getFishingHotspots = async (req, res) => {
  try {
    // Fetch fishing hotspot data using the service function
    const hotspots = await suggestFishingHotspots();

    if (!Array.isArray(hotspots) || hotspots.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No fishing hotspots available",
        data: [],
      });
    }

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
