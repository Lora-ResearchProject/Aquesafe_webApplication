const express = require("express");
const router = express.Router();
const {
  getAllSos,
  getSosById,
  getSosByVesselId,
  updateSosStatus,
  getSosByVesselIdForMobile,
} = require("../controllers/sosController");

router.get("/", getAllSos); // Get all SOS records
router.get("/get_by_id/:id", getSosById); // Get SOS record by ID
router.get("/get_by_vessel_id/:vesselId", getSosByVesselId); // Get SOS record by vesselId
router.get("/get_by_vessel_id/mobile/:vesselId", getSosByVesselIdForMobile); // Get SOS records by vesselId for the Mobile app
router.patch("/:id", updateSosStatus); // Update SOS status

module.exports = router;
