const express = require("express");
const {
  createZone,
  getAllZones,
  getZoneByName,
  updateZone,
  deleteZone,
  getVesselsByZone,
} = require("../controllers/zoneController");

const router = express.Router();

// Zone CRUD
router.post("/", createZone);
router.get("/", getAllZones);
router.get("/:name", getZoneByName);
router.put("/:name", updateZone);
router.delete("/:name", deleteZone);

// Get vessels by zone
router.get("/vessels/:zoneName", getVesselsByZone);

module.exports = router;
