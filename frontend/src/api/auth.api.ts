/**
 * Auth API: register, login, logout.
 * Uses unauthenticated requests; tokens are stored by the caller (e.g. AuthContext).
 */
import * as authStorage from "../lib/authStorage";
import { getBaseUrl } from "./client";

export interface AuthUser {
  id: string;
  username: string;
}

export interface RegisterResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

async function authFetch(path: string, body: Record<string, unknown>): Promise<Response> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const res = await authFetch("/api/auth/register", userData);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Registration failed" }));
    throw new Error(data.message || "Registration failed");
  }
  return res.json();
}

export async function loginUser(userData: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await authFetch("/api/auth/login", userData);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Login failed" }));
    throw new Error(data.message || "Login failed");
  }
  return res.json();
}

export async function logoutUser(): Promise<void> {
  const refreshToken = authStorage.getRefreshToken();
  try {
    await fetch(`${getBaseUrl()}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    authStorage.clearAuth();
  }
}
