import { Router, Request, Response } from 'express'
import type { DataEnvelope, DataListEnvelope, User, UserPublic } from '../types'
import { usersModel } from '../models/users'

const router = Router()

// Helper function to remove password from user
function sanitizeUser(user: User): UserPublic {
  const { password: _, ...userPublic } = user
  return userPublic as UserPublic
}

// GET all users
router.get('/', async (req: Request, res: Response<DataListEnvelope<UserPublic>>) => {
  try {
    const users = await usersModel.getAll()
    res.json({
      data: users.map(sanitizeUser),
      message: 'Users retrieved successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: [],
      message: 'Failed to retrieve users',
      isSuccess: false,
    })
  }
})

// POST create new user
router.post('/', async (req: Request, res: Response<DataEnvelope<UserPublic | null>>) => {
  const { name, email, password, role = 'member', age, heightCm, weightKg } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      data: null,
      message: 'Name, email, and password are required',
      isSuccess: false,
    })
  }

  try {
    const emailAlreadyExists = await usersModel.emailExists(email)
    if (emailAlreadyExists) {
      return res.status(409).json({
        data: null,
        message: 'Email already exists',
        isSuccess: false,
      })
    }

    const newUser = await usersModel.create({
      name,
      email,
      password,
      role,
      age,
      heightCm,
      weightKg,
    })

    res.status(201).json({
      data: sanitizeUser(newUser),
      message: 'User created successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: null,
      message: 'Failed to create user',
      isSuccess: false,
    })
  }
})

// GET user by ID
router.get('/:id', async (req: Request, res: Response<DataEnvelope<UserPublic | null>>) => {
  try {
    const user = await usersModel.get(Number(req.params.id))

    if (!user) {
      return res.status(404).json({
        data: null,
        message: 'User not found',
        isSuccess: false,
      })
    }

    res.json({
      data: sanitizeUser(user),
      message: 'User retrieved successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: null,
      message: 'Failed to retrieve user',
      isSuccess: false,
    })
  }
})

// PUT update user
router.put('/:id', async (req: Request, res: Response<DataEnvelope<UserPublic | null>>) => {
  const userId = Number(req.params.id)
  const { name, email, role, age, heightCm, weightKg } = req.body
  const { id: authId, role: authRole } = (req as any).user || {}

  try {
    const existingUser = await usersModel.get(userId)
    if (!existingUser) {
      return res.status(404).json({
        data: null,
        message: 'User not found',
        isSuccess: false,
      })
    }

    // Authorization: only the user themself or admin can update
    if (authId !== userId && authRole !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden: cannot update other users', isSuccess: false })
    }

    // Check if new email already exists (excluding current user)
    if (email && email !== existingUser.email) {
      const emailAlreadyExists = await usersModel.emailExists(email, userId)
      if (emailAlreadyExists) {
        return res.status(409).json({
          data: null,
          message: 'Email already exists',
          isSuccess: false,
        })
      }
    }

    const updatedUser = await usersModel.update(userId, {
      name,
      email,
      role,
      age,
      heightCm,
      weightKg,
    })

    res.json({
      data: updatedUser ? sanitizeUser(updatedUser) : null,
      message: 'User updated successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: null,
      message: 'Failed to update user',
      isSuccess: false,
    })
  }
})

// DELETE user
router.delete('/:id', async (req: Request, res: Response<DataEnvelope<null>>) => {
  const userId = Number(req.params.id)
  const { id: authId, role: authRole } = (req as any).user || {}

  try {
    const user = await usersModel.get(userId)
    if (!user) {
      return res.status(404).json({
        data: null,
        message: 'User not found',
        isSuccess: false,
      })
    }

    // Authorization: only the user or an admin can delete
    if (authId !== userId && authRole !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden: cannot delete other users', isSuccess: false })
    }

    await usersModel.delete(userId)
    res.json({
      data: null,
      message: 'User deleted successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: null,
      message: 'Failed to delete user',
      isSuccess: false,
    })
  }
})

export default router
