/**
 * Public API surface. Prefer importing from specific modules for clarity.
 * e.g. import { loginUser } from "@/api/auth.api"
 */
export { getBaseUrl, getAuthHeaders, request } from "./client";
export type { RequestOptions } from "./client";

export { registerUser, loginUser, logoutUser } from "./auth.api";
export type { AuthUser, RegisterResponse, LoginResponse } from "./auth.api";

export { fetchHealth } from "./health.api";
export type { HealthResponse } from "./health.api";

export { sendAiChat } from "./ai.api";
export type { ChatResponse } from "./ai.api";
