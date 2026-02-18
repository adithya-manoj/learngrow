import jwt from 'jsonwebtoken'
import RefreshToken from '../models/refreshToken.model.js'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

/**
 * Generates an access token for the given user.
 * Contains userId and username. Default expiry 15m.
 */
export function generateAccessToken(user) {
  if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not set')
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  )
}

/**
 * Verifies the access token and returns the decoded payload.
 */
export function verifyAccessToken(token) {
  if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not set')
  return jwt.verify(token, JWT_ACCESS_SECRET)
}

/**
 * Generates a refresh token, stores it in DB, and returns the token.
 */
export async function generateRefreshToken(user) {
  if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not set')
  const refreshToken = jwt.sign(
    { userId: user._id.toString() },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  )
  await RefreshToken.create({
    user: user._id,
    token: refreshToken
  })
  return refreshToken
}

/**
 * Verifies the refresh token and ensures it exists in DB.
 */
export async function verifyRefreshToken(token) {
  if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not set')
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET)
  const stored = await RefreshToken.findOne({ token })
  if (!stored) throw new Error('Invalid refresh token')
  return decoded
}
