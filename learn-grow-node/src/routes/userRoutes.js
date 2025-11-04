// src/routes/userRoutes.js
import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'User route working fine ' })
})

export default router
