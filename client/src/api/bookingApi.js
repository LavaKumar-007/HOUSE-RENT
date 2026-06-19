import API from "./axios";

export const createBooking = async (data) => {
  const res = await API.post("/bookings", data);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await API.get("/bookings/mine");
  return res.data;
};

export const getOwnerBookings = async () => {
  const res = await API.get("/bookings/owner");
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
