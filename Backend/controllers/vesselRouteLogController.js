const {
  fetchAllVesselLocations,
} = require("../services/vesselLocationService");

// For testing
const allLocations = [
  // Vessel 002 - Today
  {
    _id: "001",
    vesselId: "002",
    dateTime: "2025-01-29T13:14:55",
    lat: 82.0,
    lng: 15.0,
  },
  {
    _id: "002",
    vesselId: "002",
    dateTime: "2025-01-29T13:14:55",
    lat: 82.1,
    lng: 15.1,
  },
  {
    _id: "003",
    vesselId: "002",
    dateTime: "2025-01-29T13:14:55",
    lat: 82.2,
    lng: 15.2,
  },

  // Vessel 002 - Yesterday
  {
    _id: "004",
    vesselId: "002",
    dateTime: "2025-01-28T13:14:55",
    lat: 82.0,
    lng: 15.0,
  },
  {
    _id: "005",
    vesselId: "002",
    dateTime: "2025-01-28T13:14:55",
    lat: 82.1,
    lng: 15.1,
  },
  {
    _id: "006",
    vesselId: "002",
    dateTime: "2025-01-28T13:14:55",
    lat: 82.2,
    lng: 15.2,
  },

  // Vessel 002 - Day Before Yesterday
  {
    _id: "007",
    vesselId: "002",
    dateTime: "2025-01-27T13:14:55",
    lat: 82.0,
    lng: 15.0,
  },
  {
    _id: "008",
    vesselId: "002",
    dateTime: "2025-01-27T13:14:55",
    lat: 82.1,
    lng: 15.1,
  },
  {
    _id: "009",
    vesselId: "002",
    dateTime: "2025-01-27T13:14:55",
    lat: 82.2,
    lng: 15.2,
  },

  // Vessel 003 - Today
  {
    _id: "010",
    vesselId: "003",
    dateTime: "2025-01-29T13:14:55",
    lat: 83.0,
    lng: 16.0,
  },
  {
    _id: "011",
    vesselId: "003",
    dateTime: "2025-01-29T13:14:55",
    lat: 83.1,
    lng: 16.1,
  },
  {
    _id: "012",
    vesselId: "003",
    dateTime: "2025-01-29T13:14:55",
    lat: 83.2,
    lng: 16.2,
  },

  // Vessel 003 - Yesterday
  {
    _id: "013",
    vesselId: "003",
    dateTime: "2025-01-28T13:14:55",
    lat: 83.0,
    lng: 16.0,
  },
  {
    _id: "014",
    vesselId: "003",
    dateTime: "2025-01-28T13:14:55",
    lat: 83.1,
    lng: 16.1,
  },
  {
    _id: "015",
    vesselId: "003",
    dateTime: "2025-01-28T13:14:55",
    lat: 83.2,
    lng: 16.2,
  },

  // Vessel 003 - Day Before Yesterday
  {
    _id: "016",
    vesselId: "003",
    dateTime: "2025-01-27T13:14:55",
    lat: 83.0,
    lng: 16.0,
  },
  {
    _id: "017",
    vesselId: "003",
    dateTime: "2025-01-27T13:14:55",
    lat: 83.1,
    lng: 16.1,
  },
  {
    _id: "018",
    vesselId: "003",
    dateTime: "2025-01-27T13:14:55",
    lat: 83.2,
    lng: 16.2,
  },

  // Vessel 004 - Today
  {
    _id: "019",
    vesselId: "004",
    dateTime: "2025-01-29T13:14:55",
    lat: 84.0,
    lng: 17.0,
  },
  {
    _id: "020",
    vesselId: "004",
    dateTime: "2025-01-29T13:14:55",
    lat: 84.1,
    lng: 17.1,
  },
  {
    _id: "021",
    vesselId: "004",
    dateTime: "2025-01-29T13:14:55",
    lat: 84.2,
    lng: 17.2,
  },

  // Vessel 004 - Yesterday
  {
    _id: "022",
    vesselId: "004",
    dateTime: "2025-01-28T13:14:55",
    lat: 84.0,
    lng: 17.0,
  },
  {
    _id: "023",
    vesselId: "004",
    dateTime: "2025-01-28T13:14:55",
    lat: 84.1,
    lng: 17.1,
  },
  {
    _id: "024",
    vesselId: "004",
    dateTime: "2025-01-28T13:14:55",
    lat: 84.2,
    lng: 17.2,
  },

  // Vessel 004 - Day Before Yesterday
  {
    _id: "025",
    vesselId: "004",
    dateTime: "2025-01-27T13:14:55",
    lat: 84.0,
    lng: 17.0,
  },
  {
    _id: "026",
    vesselId: "004",
    dateTime: "2025-01-27T13:14:55",
    lat: 84.1,
    lng: 17.1,
  },
  {
    _id: "027",
    vesselId: "004",
    dateTime: "2025-01-27T13:14:55",
    lat: 84.2,
    lng: 17.2,
  },
];

exports.getVesselLocationsByDate = async (req, res) => {
  try {
    const { vesselId, date } = req.query;

    if (!vesselId || !date) {
      return res
        .status(400)
        .json({ status: "error", message: "Vessel ID and date are required" });
    }

    // Fetch all vessel location data
    // const allLocations = await fetchAllVesselLocations();

    // Filter by vesselId
    let vesselLocations = allLocations.filter(
      (loc) => loc.vesselId === vesselId
    );

    if (vesselLocations.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No data found for the selected vessel.",
      });
    }

    // Convert the given date to a standard format (YYYY-MM-DD)
    const givenDate = new Date(date).toISOString().split("T")[0];

    // Filter by date (matching only YYYY-MM-DD part)
    const filteredLocations = vesselLocations.filter((loc) =>
      loc.dateTime.startsWith(givenDate)
    );

    if (filteredLocations.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No data found for the selected vessel on the chosen date.",
      });
    }

    // Sort by time
    filteredLocations.sort(
      (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    );

    res.status(200).json({
      status: "success",
      message: "Vessel location data retrieved successfully",
      data: filteredLocations,
    });
  } catch (error) {
    console.error("Error fetching vessel locations:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
