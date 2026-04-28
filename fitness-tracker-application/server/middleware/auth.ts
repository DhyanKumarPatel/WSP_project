import { Request, Response, NextFunction } from 'express'
import { extractToken, verifyToken } from '../controllers/auth'
import type { DataEnvelope } from '../types'

/**
 * JWT Authentication Middleware
 * Verifies token from Authorization header and attaches user to request
 */
export function authMiddleware(req: Request, res: Response<DataEnvelope<null>>, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = extractToken(authHeader)

    if (!token) {
      return res.status(401).json({
        data: null,
        message: 'Missing or invalid authorization header',
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

    // Attach decoded token to request
    req.user = decoded

    next()
  } catch (error) {
    console.error('Auth middleware error:', error instanceof Error ? error.message : error)
    res.status(401).json({
      data: null,
      message: 'Authentication failed',
      isSuccess: false,
    })
  }
}

/**
 * Optional Authentication Middleware
 * Attempts to attach user if token is present, but doesn't fail if missing
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = extractToken(authHeader)

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        req.user = decoded
      }
    }

    next()
  } catch (error) {
    console.error('Optional auth middleware error:', error instanceof Error ? error.message : error)
    next()
  }
}
