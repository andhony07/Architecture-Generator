import STATUS_CODES from "../../constants/http/statusCodes.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notification/notification.service.js";

export const fetchNotifications = async (req, res, next) => {
  try {
    const notifications = await getUserNotifications(req.user._id);
    const unreadCount = notifications.filter((n) => !n.read).length;

    res.status(STATUS_CODES.OK).json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await markNotificationRead(id, req.user._id);

    if (!notification) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await markAllNotificationsRead(req.user._id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};
