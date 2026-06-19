import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("hh_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");
      if (!isAuthRoute) {
        localStorage.removeItem("hh_token");
        const redirect = encodeURIComponent(window.location.pathname);
        if (!window.location.pathname.includes("/login")) {
          window.location.href = `/login?redirect=${redirect}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
