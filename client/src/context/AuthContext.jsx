import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as loginApi, register as registerApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("hh_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem("hh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem("hh_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    return registerApi(formData);
  };

  const logout = () => {
    localStorage.removeItem("hh_token");
    setUser(null);
  };

  const setAuthUser = (token, userData) => {
    localStorage.setItem("hh_token", token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setAuthUser, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
