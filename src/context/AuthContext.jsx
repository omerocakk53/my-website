import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.log("Not authenticated");
      localStorage.removeItem("accessToken");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Normal axios kullanıyoruz çünkü interceptor'a ihtiyacımız yok
      const response = await api.post("/auth/login", { username, password });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Giriş başarısız",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
