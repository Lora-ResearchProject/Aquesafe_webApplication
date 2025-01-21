const express = require("express");
const {
  registerVessel,
  loginVessel,
  getAllVessels,
  getVesselDetailsById,
  editVesselDetails,
  changePassword
} = require("../controllers/vesselAuthController");

const router = express.Router();

// Routes
router.post("/vessel-register", registerVessel);
router.post("/vessel-login", loginVessel);
router.get("/", getAllVessels);
router.get("/:vesselId", getVesselDetailsById);
router.patch("/:vesselId/change-details", editVesselDetails);
router.patch("/:vesselId/change-password", changePassword);


module.exports = router;
