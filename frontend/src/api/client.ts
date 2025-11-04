const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/health`)
  if (!res.ok) {
    throw new Error('Failed to connect to backend')
  }
  return res.json()
}
