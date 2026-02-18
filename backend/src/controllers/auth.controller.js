import validator from 'validator'
import authService from '../services/auth.service.js'
import * as tokenService from '../services/token.service.js'
import User from '../models/User.js'
import RefreshToken from '../models/refreshToken.model.js'

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' })
    }
    const result = await authService.register(username, email, password)
    return res.status(201).json(result)
  } catch (err) {
    if (err.message === 'User already exists') return res.status(409).json({ message: err.message })
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const result = await authService.login(username, password)
    return res.status(200).json(result)
  } catch (err) {
    if (err.message === 'Invalid credentials') return res.status(401).json({ message: err.message })
    next(err)
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' })
    const decoded = await tokenService.verifyRefreshToken(refreshToken)
    const user = await User.findById(decoded.userId).select('username _id')
    if (!user) return res.status(401).json({ message: 'User not found' })
    const accessToken = tokenService.generateAccessToken(user)
    return res.status(200).json({ accessToken })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body
    if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken })
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch {
    return res.status(200).json({ message: 'Logged out successfully' })
  }
}
