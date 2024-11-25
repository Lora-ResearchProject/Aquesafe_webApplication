const express = require("express");
const {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageDataController");

const router = express.Router();

router.post("/", createMessage); // Create a message
router.get("/", getAllMessages); // Get all messages
router.get("/:id", getMessageById); // Get a single message by ID
router.put("/:id", updateMessage); // Update a message
router.delete("/:id", deleteMessage); // Delete a message

module.exports = router;
