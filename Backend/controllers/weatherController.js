const { getWeatherCheck } = require("../services/weatherService");

exports.checkWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Validate request parameters
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    // Fetch weather data
    const rainPercentage = await getWeatherCheck(lat, lon);

    return res.status(200).json({ rainPercentage });
  } catch (error) {
    console.error("Weather check error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
