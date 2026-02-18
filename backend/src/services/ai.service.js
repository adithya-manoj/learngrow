// src/services/ai.service.js
import axios from 'axios'

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8001'
const TIMEOUT_MS = Number(process.env.RAG_REQUEST_TIMEOUT_MS) || 30000

const client = axios.create({
  baseURL: RAG_SERVICE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Send a question to the RAG service and return the answer.
 * @param {string} question - User question
 * @returns {Promise<{ answer: string }>}
 * @throws Error with statusCode for HTTP errors (4xx/5xx from RAG or network errors)
 */
export async function chat(question) {
  try {
    const response = await client.post('/chat', { question })
    const data = response.data
    if (typeof data?.answer !== 'string') {
      throw Object.assign(new Error('Invalid response from AI service'), { statusCode: 502 })
    }
    return { answer: data.answer }
  } catch (err) {
    if (err.statusCode) throw err
    if (err.response) {
      const status = err.response.status
      const message = err.response.data?.message ?? err.response.data?.detail ?? err.message
      throw Object.assign(new Error(message || 'AI service error'), { statusCode: status >= 500 ? 502 : status })
    }
    const code = err.code
    if (code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === 'ETIMEDOUT' || code === 'ECONNABORTED') {
      throw Object.assign(new Error('AI service is unavailable'), { statusCode: 503 })
    }
    throw Object.assign(new Error('Failed to reach AI service'), { statusCode: 502 })
  }
}

export default { chat }
