// utils/notifications.js
import Notification from "../models/Notification.js";

export const pushNotification = async (userId, type, data, ticketId) => {
  try {
    await Notification.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          notifications: {
            $each: [{ ticket: ticketId, type, data }],
            $position: 0,   // add at the start
            $slice: 50      // keep only last 50
          }
        }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Error pushing notification:", error);
  }
};
