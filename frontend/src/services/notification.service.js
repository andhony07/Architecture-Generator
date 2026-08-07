import api from "../api/axios";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
