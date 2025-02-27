const express = require("express");
const {
  getChats,
  createChat,
  getLatestChats,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/:vesselId", getChats);
router.post("/", createChat);
router.get("/", getLatestChats);

module.exports = router;
