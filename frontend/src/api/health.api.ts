/**
 * Health check API (unauthenticated).
 */
import { getBaseUrl } from "./client";

export interface HealthResponse {
  status: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${getBaseUrl()}/health`);
  if (!res.ok) throw new Error("Failed to connect to backend");
  return res.json();
}
