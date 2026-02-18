/**
 * AI / RAG chat API. Requires authentication.
 */
import { request } from "./client";

export interface ChatResponse {
  answer: string;
}

export async function sendAiChat(question: string): Promise<ChatResponse> {
  const res = await request("/api/ai/chat", {
    method: "POST",
    body: { question },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "AI request failed" }));
    throw new Error(data.message || "AI request failed");
  }
  return res.json();
}
