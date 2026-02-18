// src/middlewares/errorHandler.js

/**
 * Handle 404 (Not Found) errors.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

/**
 * Centralized error handler.
 * Uses err.statusCode or err.status if set; otherwise keeps res.statusCode or 500.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? err.status ?? (res.statusCode !== 200 ? res.statusCode : 500)
  const code = Math.min(Math.max(statusCode, 400), 599)
  res.status(code).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && err.stack && { stack: err.stack }),
  })
}
