import API from "./axios";

export const createBooking = async (data) => {
  const res = await API.post("/bookings", data);
  return res.data;
};

export const getMyBookings = async (params = {}) => {
  const res = await API.get("/bookings/mine", { params });
  return res.data;
};

export const getOwnerBookings = async (params = {}) => {
  const res = await API.get("/bookings/owner", { params });
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await API.patch(`/bookings/${id}/status`, { status });
  return res.data;
};

export const getAllBookings = async () => {
  const res = await API.get("/bookings/all");
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await API.get(`/bookings/${id}`);
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await API.patch(`/bookings/${id}/cancel`);
  return res.data;
};
