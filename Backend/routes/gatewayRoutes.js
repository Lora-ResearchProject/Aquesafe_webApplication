const express = require("express");
const {
  getGateways,
  createGateway,
  updateGateway,
  deleteGateway,
  getGatewayById,
} = require("../controllers/gatewayController");

const router = express.Router();

router.get("/", getGateways);
router.get("/:id", getGatewayById);
router.post("/", createGateway);
router.put("/:id", updateGateway);
router.delete("/:id", deleteGateway);

module.exports = router;
