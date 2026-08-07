import Notification from "../../models/Notification.js";

export const createNotification = async ({ user, type, title, message, project }) => {
  return await Notification.create({
    user,
    type,
    title,
    message,
    project: project || null,
  });
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(30);
};

export const markNotificationRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};

export const markAllNotificationsRead = async (userId) => {
  return await Notification.updateMany(
    { user: userId, read: false },
    { read: true }
  );
};
