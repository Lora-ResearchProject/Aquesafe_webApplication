const Notification = require("../models/notificationModel");
const { emitEvent } = require("../services/websocket");

exports.createNotification = async ({
  messageTitle,
  messageDescription,
  Type,
}) => {
  try {
    const newNotification = new Notification({
      messageTitle,
      messageDescription,
      Type,
    });

    const savedNotification = await newNotification.save();
    
    // Emit WebSocket event
    emitEvent("new_notification", savedNotification);

    return savedNotification;
  } catch (error) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    const unreadCount = await Notification.countDocuments({ read: false });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      req.params.id
    );

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const unreadNotifications = await Notification.find({ read: false });

    res.status(200).json(unreadNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const notifications = await Notification.find({ Type: type });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
