import API from "./axios";

export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const verifyEmail = async (token) => {
  const res = await API.get(`/auth/verify/${token}`);
  return res.data;
};

export const resendVerification = async (email) => {
  const res = await API.post("/auth/resend-verification", { email });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await API.post(`/auth/reset-password/${token}`, { password });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/auth/profile", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await API.put("/auth/change-password", data);
  return res.data;
};

export const getFavorites = async () => {
  const res = await API.get("/auth/favorites");
  return res.data;
};

export const toggleFavorite = async (propertyId) => {
  const res = await API.post(`/auth/favorites/${propertyId}`);
  return res.data;
};

export const getAllUsers = async (params) => {
  const res = await API.get("/auth/users", { params });
  return res.data;
};
