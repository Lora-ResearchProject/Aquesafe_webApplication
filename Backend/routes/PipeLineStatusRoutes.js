const express = require("express");
const router = express.Router();
const { forwardLoraStatus } = require("../controllers/PipeLineStatusController");

router.post("/pipeline-status", forwardLoraStatus);

module.exports = router;