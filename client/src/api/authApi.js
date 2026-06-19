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

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const toggleFavorite = async (propertyId) => {
  const res = await API.post(`/auth/favorites/${propertyId}`);
  return res.data;
};
