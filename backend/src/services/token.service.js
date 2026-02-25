import jwt from 'jsonwebtoken'
import RefreshToken from '../models/refreshToken.model.js'

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set')
  return secret
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set')
  return secret
}

/**
 * Generates an access token for the given user.
 * Contains userId and username. Default expiry 15m.
 */
export function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    getAccessSecret(),
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  )
}

/**
 * Verifies the access token and returns the decoded payload.
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, getAccessSecret())
}

/**
 * Generates a refresh token, stores it in DB, and returns the token.
 */
export async function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { userId: user._id.toString() },
    getRefreshSecret(),
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
  const decoded = jwt.verify(token, getRefreshSecret())
  const stored = await RefreshToken.findOne({ token })
  if (!stored) throw new Error('Invalid refresh token')
  return decoded
}
