import bcrypt from 'bcrypt'
import User from '../models/User.js'
import * as tokenService from './token.service.js'

async function register(username, email, password) {
  const existing = await User.findOne({ $or: [{ username }, { email }] })
  if (existing) throw new Error('User already exists')
  const hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10)
  const user = await User.create({ username, email, password: hashed })
  const accessToken = tokenService.generateAccessToken(user)
  const refreshToken = await tokenService.generateRefreshToken(user)
  return { user: { id: user._id, username: user.username }, accessToken, refreshToken }
}

async function login(username, password) {
  const user = await User.findOne({ username })
  if (!user) throw new Error('Invalid credentials')
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')
  const accessToken = tokenService.generateAccessToken(user)
  const refreshToken = await tokenService.generateRefreshToken(user)
  return { user: { id: user._id, username: user.username }, accessToken, refreshToken }
}

export default { register, login }
