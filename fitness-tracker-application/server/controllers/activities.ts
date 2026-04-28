import { Router, Request, Response } from 'express'
import type { DataEnvelope, DataListEnvelope, Activity } from '../types'
import { activitiesModel } from '../models/activities'
import { usersModel } from '../models/users'

const router = Router()

// helper to get authenticated user id/role (auth middleware attaches user)
function authInfo(req: Request) {
  // middleware augments Request with `user` at runtime; cast to any for TS
  const u = (req as any).user
  return { id: u?.id as number | undefined, role: u?.role as string | undefined }
}

// GET all activities
router.get('/', async (_req: Request, res: Response<DataListEnvelope<Activity>>) => {
  try {
    const activities = await activitiesModel.getAll()
    res.json({ data: activities, message: 'Activities retrieved successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: [], message: 'Failed to retrieve activities', isSuccess: false })
  }
})

// POST create new activity — use authenticated user unless admin sets userId
router.post('/', async (req: Request, res: Response<DataEnvelope<Activity | null>>) => {
  const { type, durationMin, calories, date, notes } = req.body
  const { id: authId, role } = authInfo(req)
  const requestedUserId = Number(req.body.userId || authId)

  if (!requestedUserId || !type || durationMin === undefined || calories === undefined || !date) {
    return res.status(400).json({ data: null, message: 'userId, type, durationMin, calories, and date are required', isSuccess: false })
  }

  try {
    // Only admin can create activities for other users
    if (authId !== requestedUserId && role !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden: cannot create activity for another user', isSuccess: false })
    }

    const user = await usersModel.get(requestedUserId)
    if (!user) return res.status(404).json({ data: null, message: 'User not found', isSuccess: false })

    const newActivity = await activitiesModel.create({
      userId: requestedUserId,
      type,
      durationMin,
      calories,
      date,
      notes,
    })

    res.status(201).json({ data: newActivity, message: 'Activity created successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: null, message: 'Failed to create activity', isSuccess: false })
  }
})

// GET activities by user ID (MUST come before /:id)
router.get('/user/:userId', async (req: Request, res: Response<DataListEnvelope<Activity>>) => {
  const userId = Number(req.params.userId)
  const { id: authId, role } = authInfo(req)

  try {
    if (authId !== userId && role !== 'admin') {
      return res.status(403).json({ data: [], message: 'Forbidden', isSuccess: false })
    }

    const user = await usersModel.get(userId)
    if (!user) return res.status(404).json({ data: [], message: 'User not found', isSuccess: false })

    const activities = await activitiesModel.getByUserId(userId)
    res.json({ data: activities, message: 'User activities retrieved successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: [], message: 'Failed to retrieve user activities', isSuccess: false })
  }
})

// GET activity stats by user ID (MUST come before /:id)
router.get('/stats/:userId', async (req: Request, res: Response<DataEnvelope<{ totalActivities: number; totalDuration: number; totalCalories: number } | null>>) => {
  const userId = Number(req.params.userId)
  const { id: authId, role } = authInfo(req)

  try {
    if (authId !== userId && role !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden', isSuccess: false })
    }

    const user = await usersModel.get(userId)
    if (!user) return res.status(404).json({ data: null, message: 'User not found', isSuccess: false })

    const stats = await activitiesModel.getStatsByUserId(userId)
    res.json({ data: stats, message: 'Activity stats retrieved successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: null, message: 'Failed to retrieve activity stats', isSuccess: false })
  }
})

// GET activity by ID
router.get('/:id', async (req: Request, res: Response<DataEnvelope<Activity | null>>) => {
  try {
    const activity = await activitiesModel.get(Number(req.params.id))
    if (!activity) return res.status(404).json({ data: null, message: 'Activity not found', isSuccess: false })
    res.json({ data: activity, message: 'Activity retrieved successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: null, message: 'Failed to retrieve activity', isSuccess: false })
  }
})

// PUT update activity — require owner or admin
router.put('/:id', async (req: Request, res: Response<DataEnvelope<Activity | null>>) => {
  const activityId = Number(req.params.id)
  const { type, durationMin, calories, date, notes } = req.body
  const { id: authId, role } = authInfo(req)

  try {
    const existingActivity = await activitiesModel.get(activityId)
    if (!existingActivity) return res.status(404).json({ data: null, message: 'Activity not found', isSuccess: false })

    if (existingActivity.userId !== authId && role !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden: cannot modify another user\'s activity', isSuccess: false })
    }

    const updatedActivity = await activitiesModel.update(activityId, { type, durationMin, calories, date, notes })
    res.json({ data: updatedActivity, message: 'Activity updated successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: null, message: 'Failed to update activity', isSuccess: false })
  }
})

// DELETE activity — require owner or admin
router.delete('/:id', async (req: Request, res: Response<DataEnvelope<null>>) => {
  const activityId = Number(req.params.id)
  const { id: authId, role } = authInfo(req)

  try {
    const activity = await activitiesModel.get(activityId)
    if (!activity) return res.status(404).json({ data: null, message: 'Activity not found', isSuccess: false })

    if (activity.userId !== authId && role !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden: cannot delete another user\'s activity', isSuccess: false })
    }

    await activitiesModel.delete(activityId)
    res.json({ data: null, message: 'Activity deleted successfully', isSuccess: true })
  } catch {
    res.status(500).json({ data: null, message: 'Failed to delete activity', isSuccess: false })
  }
})

export default router
