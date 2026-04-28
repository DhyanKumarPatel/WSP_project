import { Router, Request, Response } from 'express'
import type { DataEnvelope, DataListEnvelope, Friendship, User, Activity, UserPublic } from '../types'
import { friendsModel } from '../models/friends'
import { usersModel } from '../models/users'
import { activitiesModel } from '../models/activities'

const router = Router()

// Helper function to remove password from user
function sanitizeUser(user: User): UserPublic {
  const { password: _, ...userPublic } = user
  return userPublic as UserPublic
}

// GET friends of user
router.get('/:userId', async (req: Request, res: Response<DataListEnvelope<UserPublic>>) => {
  const userId = Number(req.params.userId)
  const { id: authId, role: authRole } = (req as any).user || {}

  try {
    // Authorization: owner or admin only
    if (authId !== userId && authRole !== 'admin') {
      return res.status(403).json({ data: [], message: 'Forbidden', isSuccess: false })
    }

    // Verify user exists
    const user = await usersModel.get(userId)
    if (!user) {
      return res.status(404).json({
        data: [],
        message: 'User not found',
        isSuccess: false,
      })
    }

    const friendIds = await friendsModel.getFriendIds(userId)
    const friends = await Promise.all(
      friendIds.map((friendId) => usersModel.get(friendId))
    )

    const sanitizedFriends = friends
      .filter((friend): friend is User => friend !== null)
      .map(sanitizeUser)

    res.json({
      data: sanitizedFriends,
      message: 'Friends retrieved successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: [],
      message: 'Failed to retrieve friends',
      isSuccess: false,
    })
  }
})

// POST add friend
router.post('/', async (req: Request, res: Response<DataEnvelope<Friendship | null>>) => {
  const { userId, friendId } = req.body

  if (!userId || !friendId) {
    return res.status(400).json({
      data: null,
      message: 'userId and friendId are required',
      isSuccess: false,
    })
  }

  if (userId === friendId) {
    return res.status(400).json({
      data: null,
      message: 'Cannot add yourself as friend',
      isSuccess: false,
    })
  }

  try {
    const { id: authId, role: authRole } = (req as any).user || {}

    // Only the authenticated user (or admin) may create a friendship on their behalf
    if (authId !== Number(userId) && authRole !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden', isSuccess: false })
    }

    // Verify both users exist
    const user1 = await usersModel.get(userId)
    if (!user1) {
      return res.status(404).json({
        data: null,
        message: 'User not found',
        isSuccess: false,
      })
    }

    const user2 = await usersModel.get(friendId)
    if (!user2) {
      return res.status(404).json({
        data: null,
        message: 'Friend user not found',
        isSuccess: false,
      })
    }

    // Check if already friends
    const areFriends = await friendsModel.isFriends(userId, friendId)
    if (areFriends) {
      return res.status(409).json({
        data: null,
        message: 'Already friends',
        isSuccess: false,
      })
    }

    const newFriendship = await friendsModel.create({
      userId,
      friendId,
    })

    res.status(201).json({
      data: newFriendship,
      message: 'Friend added successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: null,
      message: 'Failed to add friend',
      isSuccess: false,
    })
  }
})

// DELETE remove friend
router.delete('/:userId/:friendId', async (req: Request, res: Response<DataEnvelope<null>>) => {
  const userId = Number(req.params.userId)
  const friendId = Number(req.params.friendId)
  const { id: authId, role: authRole } = (req as any).user || {}

  try {
    // Verify both users exist
    const user1 = await usersModel.get(userId)
    if (!user1) {
      return res.status(404).json({
        data: null,
        message: 'User not found',
        isSuccess: false,
      })
    }

    const user2 = await usersModel.get(friendId)
    if (!user2) {
      return res.status(404).json({
        data: null,
        message: 'Friend user not found',
        isSuccess: false,
      })
    }

    // Only one of the participants or an admin can remove the friendship
    if (authId !== userId && authId !== friendId && authRole !== 'admin') {
      return res.status(403).json({ data: null, message: 'Forbidden', isSuccess: false })
    }

    const removed = await friendsModel.removeFriendship(userId, friendId)

    if (!removed) {
      return res.status(404).json({
        data: null,
        message: 'Friendship not found',
        isSuccess: false,
      })
    }

    res.json({
      data: null,
      message: 'Friend removed successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: null,
      message: 'Failed to remove friend',
      isSuccess: false,
    })
  }
})

// GET friend activities
router.get('/:userId/activities', async (req: Request, res: Response<DataListEnvelope<Activity & { userName: string }>>) => {
  const userId = Number(req.params.userId)
  const { id: authId, role: authRole } = (req as any).user || {}

  try {
    // Authorization: owner or admin only
    if (authId !== userId && authRole !== 'admin') {
      return res.status(403).json({ data: [], message: 'Forbidden', isSuccess: false })
    }

    // Verify user exists
    const user = await usersModel.get(userId)
    if (!user) {
      return res.status(404).json({
        data: [],
        message: 'User not found',
        isSuccess: false,
      })
    }

    const friendIds = await friendsModel.getFriendIds(userId)
    const friendActivities: Array<Activity & { userName: string }> = []

    for (const friendId of friendIds) {
      const friend = await usersModel.get(friendId)
      if (friend) {
        const activities = await activitiesModel.getByUserId(friendId)
        activities.forEach((activity) => {
          friendActivities.push({
            ...activity,
            userName: friend.name,
          })
        })
      }
    }

    friendActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    res.json({
      data: friendActivities,
      message: 'Friend activities retrieved successfully',
      isSuccess: true,
    })
  } catch {
    res.status(500).json({
      data: [],
      message: 'Failed to retrieve friend activities',
      isSuccess: false,
    })
  }
})

export default router
