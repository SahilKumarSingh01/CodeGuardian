// controllers/userController.js
import Notification from "../models/Notification.js";

// 🛎 Get all notifications for the logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notificationDoc = await Notification.findOne({ user: userId });

    if (!notificationDoc || notificationDoc.notifications.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(notificationDoc.notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// 🗑 Remove a notification by its _id from the notifications array
export const removeNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notifId } = req.params;

    // Only remove notification if it belongs to the user
    const result = await Notification.updateOne(
      { user: userId },
      { $pull: { notifications: { _id: notifId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Notification not found or not authorized" });
    }

    res.status(200).json({ message: "Notification removed successfully" });
  } catch (err) {
    console.error("Remove notification error:", err);
    res.status(500).json({ message: "Failed to remove notification" });
  }
};
