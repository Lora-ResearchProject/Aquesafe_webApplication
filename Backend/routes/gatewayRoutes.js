const express = require("express");
const { getGateways, createGateway } = require("../controllers/gatewayController");

const router = express.Router();

router.get("/", getGateways);
router.post("/", createGateway);

module.exports = router;
