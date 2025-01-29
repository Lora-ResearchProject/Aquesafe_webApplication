const express = require("express");
const {
  getVesselLocationsByDate,
} = require("../controllers/vesselRouteLogController");

const router = express.Router();

router.get("/locationsByDate", getVesselLocationsByDate);

module.exports = router;
