const express = require("express");
const router = express.Router();
const {
  getAllSos,
  getSosById,
  updateSosStatus,
} = require("../controllers/sosController");

router.get("/", getAllSos); // Get all SOS records
router.get("/:id", getSosById); // Get SOS record by ID
router.patch("/:id", updateSosStatus); // Update SOS status

module.exports = router;
