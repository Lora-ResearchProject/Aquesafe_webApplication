import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/outline";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  getUnreadNotifications,
} from "../../services/notificationService";

import notifysound from "../../assets/sounds/notification_sound.mp3";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false); // Toggle for showing all/unread notifications

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData.notifications.reverse()); // Reverse to show latest first
      if (notificationsData.unreadCount > unreadCount) {
        playNotificationSound();
      }

      setUnreadCount(notificationsData.unreadCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch notifications every minute
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [unreadCount]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (id, isUnread) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return; // Exit if user cancels

    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );

      // Decrease unread count only if the deleted notification was unread
      if (isUnread) {
        setUnreadCount((prev) => Math.max(prev - 1, 0)); // Ensure count doesn't go negative
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio(notifysound);
    audio.play();
  };

  // Filter notifications based on the toggle state
  const filteredNotifications = showAll
    ? notifications
    : notifications.filter((notification) => !notification.read);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative focus:outline-none flex items-center"
      >
        <BellIcon className="h-7 w-7 text-gray-700 cursor-pointer hover:text-gray-900" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Only show unread</span>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    showAll ? "bg-gray-300" : "bg-blue-500"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      showAll ? "translate-x-0" : "translate-x-4"
                    }`}
                  />
                </button>
              </div>
            </div>
            {filteredNotifications.length === 0 ? (
              <p className="text-gray-500 text-center">
                No notifications found.
              </p>
            ) : (
              <ul className="max-h-[800px] overflow-y-auto space-y-2">
                {filteredNotifications.map((notification) => (
                  <li
                    key={notification._id}
                    className="p-3 bg-white shadow-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    {/* Notification Content */}
                    <div className="flex flex-col">
                      <p className="font-medium text-gray-800">
                        {notification.messageTitle}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.messageDescription}
                      </p>

                      {/* Footer: Date & Actions */}
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <div className="flex space-x-3">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteNotification(
                                notification._id,
                                !notification.read
                              )
                            }
                            className="text-red-500 hover:text-red-700 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
