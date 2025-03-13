const express = require("express");
const {
  getChats,
  createChat,
  getLatestChats,
  createChatsForMultipleVessels,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/:vesselId", getChats);
router.post("/", createChat);
router.get("/", getLatestChats);
router.post("/multiple", createChatsForMultipleVessels);

module.exports = router;
