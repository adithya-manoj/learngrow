import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import expressWinston from 'express-winston'
import { logger, requestStream } from './config/logger.js'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'
import { rateLimiter } from './middlewares/rateLimiter.js'

const app = express()

app.use(helmet())

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  optionsSuccessStatus: 200
}))

app.use(compression())
app.use(express.json({ limit: '10kb' }))
app.use(rateLimiter)
app.use(morgan('combined', { stream: requestStream }))
app.use('/api/users', userRoutes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.use(notFound)
app.use(errorHandler)

export default app
