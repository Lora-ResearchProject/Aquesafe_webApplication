const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  deleteNotification,
  markNotificationAsRead,
  getUnreadNotifications,
  getNotificationsByType,
} = require("../controllers/notificationController");

router.get("/all", getAllNotifications);
router.get("/one/:id", getNotificationById);
router.delete("/:id", deleteNotification);
router.patch("/:id/read", markNotificationAsRead);
router.get("/unread", getUnreadNotifications);
router.get("/type/:type", getNotificationsByType);

module.exports = router;
