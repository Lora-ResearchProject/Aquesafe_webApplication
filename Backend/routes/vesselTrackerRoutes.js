const express = require("express");
const {
  getLatestVesselLocations,
} = require("../controllers/vesselTrackerController");

const router = express.Router();

router.get("/latest-locations", getLatestVesselLocations);

module.exports = router;
