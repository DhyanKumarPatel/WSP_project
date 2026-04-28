import dotenv from 'dotenv'
import express, { Express, Request, Response, NextFunction } from 'express'
import type { DataEnvelope } from './types'

// Load environment variables
dotenv.config()

// Import controllers
import authController from './controllers/auth'
import usersController from './controllers/users'
import activitiesController from './controllers/activities'
import friendsController from './controllers/friends'

// Import middleware
import { authMiddleware } from './middleware/auth'

const app: Express = express()
const PORT = process.env.PORT || 3000

// ============================================
// MIDDLEWARE
// ============================================

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

// JSON body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req: Request, res: Response<DataEnvelope<null>>) => {
  res.json({
    data: null,
    message: 'Server is running',
    isSuccess: true,
  })
})

// ============================================
// API ROUTES
// ============================================

// Mount controllers at /api/v1/*
app.use('/api/v1/auth', authController)

// Protected routes - require JWT authentication
app.use('/api/v1/users', authMiddleware, usersController)
app.use('/api/v1/activities', authMiddleware, activitiesController)
app.use('/api/v1/friends', authMiddleware, friendsController)

// ============================================
// 404 Handler
// ============================================

app.use((req: Request, res: Response<DataEnvelope<null>>) => {
  res.status(404).json({
    data: null,
    message: `Route not found: ${req.method} ${req.path}`,
    isSuccess: false,
  })
})

// ============================================
// ERROR HANDLER
// ============================================

app.use((err: Error, req: Request, res: Response<DataEnvelope<null>>, _next: NextFunction) => {
  console.error('Error:', err.message)

  res.status(500).json({
    data: null,
    message: 'Internal server error',
    isSuccess: false,
  })
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(` Fitness Tracker API Server running on port ${PORT}`)
  console.log(` Health check: http://localhost:${PORT}/health`)
  console.log(` API Base URL: http://localhost:${PORT}/api/v1`)
})

export default app
