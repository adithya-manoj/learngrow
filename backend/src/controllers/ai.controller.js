// src/controllers/ai.controller.js
import * as aiService from '../services/ai.service.js'

const MAX_QUESTION_LENGTH = 2000

/**
 * Validate chat request body. Throws error with statusCode for invalid input.
 */
function validateChatBody(body) {
  if (!body || typeof body !== 'object') {
    const err = new Error('Request body must be a JSON object')
    err.statusCode = 400
    throw err
  }
  const { question } = body
  if (question === undefined || question === null) {
    const err = new Error('question is required')
    err.statusCode = 400
    throw err
  }
  if (typeof question !== 'string') {
    const err = new Error('question must be a string')
    err.statusCode = 400
    throw err
  }
  const trimmed = question.trim()
  if (trimmed.length === 0) {
    const err = new Error('question cannot be empty')
    err.statusCode = 400
    throw err
  }
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    const err = new Error(`question must be at most ${MAX_QUESTION_LENGTH} characters`)
    err.statusCode = 400
    throw err
  }
  return trimmed
}

/**
 * POST /api/ai/chat
 * Body: { question: string }
 * Response: { answer: string }
 */
export async function chat(req, res, next) {
  try {
    const question = validateChatBody(req.body)
    const { answer } = await aiService.chat(question)
    res.status(200).json({ answer })
  } catch (err) {
    next(err)
  }
}
