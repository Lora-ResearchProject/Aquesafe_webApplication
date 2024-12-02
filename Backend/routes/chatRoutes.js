const express = require("express");
const { getChats, createChat } = require("../controllers/chatController");

const router = express.Router();

router.get("/:vesselId", getChats);
router.post("/", createChat);

module.exports = router;
