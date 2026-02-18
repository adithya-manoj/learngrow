const ACCESS_KEY = "learn_grow_access_token";
const REFRESH_KEY = "learn_grow_refresh_token";
const USER_KEY = "learn_grow_user";

export interface StoredUser {
  username: string;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function getUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredUser;
    return data?.username ? data : null;
  } catch {
    return null;
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function setUser(user: StoredUser | null): void {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
}

let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(cb: (() => void) | null): void {
  onSessionExpired = cb;
}

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  onSessionExpired?.();
}
