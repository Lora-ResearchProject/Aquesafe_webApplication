const express = require("express");
const {
  createZone,
  getAllZones,
  updateZone,
  deleteZone,
  getVesselsByZone,
  getZoneById,
} = require("../controllers/zoneController");

const router = express.Router();

// Zone CRUD
router.post("/", createZone);
router.get("/", getAllZones);
router.get("/:id", getZoneById);
router.put("/:id", updateZone);
router.delete("/:id", deleteZone);

// Get vessels by zone
router.get("/vessels/:zoneId", getVesselsByZone);

module.exports = router;
