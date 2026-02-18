import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authStorage from "../lib/authStorage";
import { logoutUser } from "../api/auth.api";

export interface User {
  username: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(authStorage.getUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    authStorage.setOnSessionExpired(() => setUser(null));
    return () => authStorage.setOnSessionExpired(null);
  }, []);

  const login = useCallback((user: User, accessToken: string, refreshToken: string) => {
    authStorage.setUser(user);
    authStorage.setTokens(accessToken, refreshToken);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    logoutUser().finally(() => {
      authStorage.clearAuth();
      setUser(null);
    });
  }, []);

  const value: AuthContextValue = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
