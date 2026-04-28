export type Role = 'admin' | 'member'

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: Role
  age?: number
  heightCm?: number
  weightKg?: number
}

export type ActivityType =
  | 'Running'
  | 'Walking'
  | 'Cycling'
  | 'Gym'
  | 'Yoga'
  | 'Swimming'

export type Activity = {
  id: number
  userId: number
  type: ActivityType
  durationMin: number
  calories: number
  date: string
  notes?: string
}

export type Friendship = {
  id: number
  userId: number
  friendId: number
}