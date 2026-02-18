import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import expressWinston from 'express-winston'
import { logger, requestStream } from './config/logger.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/auth.routes.js'
import aiRoutes from './routes/ai.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'
import { rateLimiter } from './middlewares/rateLimiter.js'
import { authMiddleware } from './middlewares/auth.middleware.js'

const app = express()

app.use(helmet())

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(null, false)
  },
  optionsSuccessStatus: 200,
  credentials: true,
}))

app.use(compression())
app.use(express.json({ limit: '10kb' }))
app.use(rateLimiter)
app.use(morgan('combined', { stream: requestStream }))
app.use('/api/auth', authRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.use(notFound)
app.use(errorHandler)

export default app
