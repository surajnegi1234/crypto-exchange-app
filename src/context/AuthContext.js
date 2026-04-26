import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("xcrypto_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("xcrypto_token") || null);

  const saveSession = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("xcrypto_user", JSON.stringify(userData));
    localStorage.setItem("xcrypto_token", tokenData);
    api.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;
  };

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    saveSession(data.user, data.token);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data.user, data.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("xcrypto_user");
    localStorage.removeItem("xcrypto_token");
    delete api.defaults.headers.common["Authorization"];
  }, []);

  // Set token on api instance on mount
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
