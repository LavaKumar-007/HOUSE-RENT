import API from "./axios";

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await API.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await API.patch("/notifications/read-all");
  return res.data;
};
