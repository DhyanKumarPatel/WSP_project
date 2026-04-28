// Response Envelope Types - Standard format for all API responses
export type DataEnvelope<T> = {
  data: T
  message: string
  isSuccess: boolean
}

export type DataListEnvelope<T> = {
  data: T[]
  message: string
  isSuccess: boolean
}

// Role Type
export type Role = 'admin' | 'member'

// Activity Type
export type ActivityType = 'Running' | 'Walking' | 'Cycling' | 'Gym' | 'Yoga' | 'Swimming'

// User Type
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

// Activity Type
export type Activity = {
  id: number
  userId: number
  type: ActivityType
  durationMin: number
  calories: number
  date: string
  notes?: string
}

// Friendship Type
export type Friendship = {
  id: number
  userId: number
  friendId: number
}

// User without password (for API responses - don't send passwords to frontend)
export type UserPublic = Omit<User, 'password'>
