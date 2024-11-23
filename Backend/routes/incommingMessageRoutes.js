const express = require("express");
const { storeVesselLocation } = require("../controllers/incommingMessageController");

const router = express.Router();

router.post("/store-location", storeVesselLocation);

module.exports = router;
