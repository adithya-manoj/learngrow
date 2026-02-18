/**
 * Base API client: config, auth headers, token refresh, and authenticated request.
 * Domain-specific calls live in auth.api.ts, health.api.ts, ai.api.ts.
 */
import * as authStorage from "../lib/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getBaseUrl(): string {
  return API_BASE_URL;
}

export function getAuthHeaders(): Record<string, string> {
  const token = authStorage.getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Session expired");
  }
  const { accessToken } = await res.json();
  if (!accessToken) throw new Error("No access token in refresh response");
  authStorage.setAccessToken(accessToken);
  return accessToken;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | string;
  skipAuth?: boolean;
}

/**
 * Performs a request to API_BASE_URL + path. Adds Bearer token and retries once on 401 after refresh.
 */
export async function request(
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { skipAuth = false, body, headers: optHeaders, ...rest } = options;
  const headers = skipAuth
    ? { "Content-Type": "application/json", ...(optHeaders as Record<string, string>) }
    : { ...getAuthHeaders(), ...(optHeaders as Record<string, string>) };

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const init: RequestInit = {
    ...rest,
    headers,
    body: typeof body === "string" ? body : body ? JSON.stringify(body) : undefined,
  };

  let res = await fetch(url, init);

  if (res.status === 401 && !skipAuth) {
    try {
      await refreshAccessToken();
      res = await fetch(url, { ...init, headers: getAuthHeaders() });
    } catch {
      authStorage.clearAuth();
      throw new Error("Session expired. Please sign in again.");
    }
  }

  return res;
}
