const express = require("express");
const {
  registerVessel,
  loginVessel,
  getAllVessels
} = require("../controllers/vesselAuthController");

const router = express.Router();

// Routes
router.post("/vessel-register", registerVessel);
router.post("/vessel-login", loginVessel);
router.get("/", getAllVessels);


module.exports = router;
