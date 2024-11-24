const express = require("express");
const {
  registerVessel,
  loginVessel,
} = require("../controllers/vesselAuthController");

const router = express.Router();

// Routes
router.post("/vessel-register", registerVessel);
router.post("/vessel-login", loginVessel);

module.exports = router;
