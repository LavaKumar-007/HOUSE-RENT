import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getMe,
  login as loginApi,
  register as registerApi,
  toggleFavorite as toggleFavoriteApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem("hh_token", data.token);
    const me = await getMe();
    setUser(me.user);
    return { ...data, user: me.user };
  };

  const register = async (formData) => registerApi(formData);

  const logout = () => {
    localStorage.removeItem("hh_token");
    setUser(null);
  };

  const setAuthUser = async (token, userData) => {
    localStorage.setItem("hh_token", token);
    if (userData?.favorites) {
      setUser(userData);
    } else {
      const me = await getMe();
      setUser(me.user);
    }
  };

  const updateFavorites = async (propertyId) => {
    const data = await toggleFavoriteApi(propertyId);
    setUser((prev) => (prev ? { ...prev, favorites: data.favorites } : prev));
    return data;
  };

  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setAuthUser,
        loadUser,
        updateFavorites,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
