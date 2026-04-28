import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { DataEnvelope, UserPublic, User } from '../types'
import { usersModel } from '../models/users'

// ============================================
// JWT UTILITIES
// ============================================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'your-super-secret-jwt-key-change-in-production-min-32-chars!'

const JWT_EXPIRATION = '7d'

export interface JwtPayload {
  id: number
  email: string
  role: string
}

export interface DecodedToken extends JwtPayload {
  iat: number
  exp: number
}

// Add req.user support for Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    algorithm: 'HS256',
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as DecodedToken

    return decoded
  } catch (error) {
    console.error(
      'Token verification failed:',
      error instanceof Error ? error.message : error
    )

    return null
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null

  const parts = authHeader.split(' ')

  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null
  }

  return parts[1]
}

/**
 * Check if token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  return verifyToken(token) !== null
}

// ============================================
// AUTHORIZATION MIDDLEWARE
// ============================================

export function requireAuth(
  req: Request,
  res: Response<DataEnvelope<null>>,
  next: NextFunction
) {
  const token = extractToken(req.headers.authorization)

  if (!token) {
    return res.status(401).json({
      data: null,
      message: 'Authorization token is required',
      isSuccess: false,
    })
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({
      data: null,
      message: 'Invalid or expired token',
      isSuccess: false,
    })
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  }

  next()
}

export function requireAdmin(
  req: Request,
  res: Response<DataEnvelope<null>>,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      data: null,
      message: 'Authentication required',
      isSuccess: false,
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      data: null,
      message: 'Admin access required',
      isSuccess: false,
    })
  }

  next()
}

// ============================================
// ROUTER
// ============================================

const router = Router()

interface LoginResponse {
  user: UserPublic
  token: string
}

router.post(
  '/login',
  async (req: Request, res: Response<DataEnvelope<LoginResponse | null>>) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        message: 'Email and password are required',
        isSuccess: false,
      })
    }

    try {
      const user = await usersModel.getByEmail(email)

      if (!user) {
        return res.status(401).json({
          data: null,
          message: 'Invalid email or password',
          isSuccess: false,
        })
      }

      if (user.password !== password) {
        return res.status(401).json({
          data: null,
          message: 'Invalid email or password',
          isSuccess: false,
        })
      }

      const token = generateToken(user)

      const { password: _, ...userPublic } = user

      res.json({
        data: {
          user: userPublic as UserPublic,
          token,
        },
        message: 'Login successful',
        isSuccess: true,
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)

      console.error('Login error:', errorMsg)

      res.status(500).json({
        data: null,
        message: 'Login failed: ' + errorMsg,
        isSuccess: false,
      })
    }
  }
)

router.get(
  '/me',
  requireAuth,
  async (req: Request, res: Response<DataEnvelope<JwtPayload | null>>) => {
    res.json({
      data: req.user ?? null,
      message: 'Current user retrieved successfully',
      isSuccess: true,
    })
  }
)

export default router