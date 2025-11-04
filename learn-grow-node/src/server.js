import dotenv from 'dotenv'
import http from 'http'
import app from './app.js'
import { connectDB } from './config/db.js'
import { logger } from './config/logger.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const server = http.createServer(app)

const startServer = async () => {
  await connectDB()

  server.listen(PORT, () => {
    logger.info(` Server running on port ${PORT}`)
  })
}

startServer()
