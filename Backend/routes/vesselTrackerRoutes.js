const express = require("express");
const {
  getLatestVesselLocations,
} = require("../controllers/vesselTrackerController");

const router = express.Router();

router.get("/latestLocations", getLatestVesselLocations);

module.exports = router;
