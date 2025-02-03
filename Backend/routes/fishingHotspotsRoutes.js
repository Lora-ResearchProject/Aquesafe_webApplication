const express = require("express");
const {
  getFishingHotspots,
} = require("../controllers/fishingHotspotsController");
const { route } = require("./gatewayRoutes");

const router = express.Router();

router.get("/", getFishingHotspots);

module.exports = router;
