const express = require("express");
const router = express.Router();
const { checkWeather } = require("../controllers/weatherController");

router.get("/", checkWeather);

module.exports = router;
