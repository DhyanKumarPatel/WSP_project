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

// Paginated list envelope - used for infinite-scroll endpoints
export type PaginatedEnvelope<T> = {
  data: T[]
  total: number
  limit: number
  offset: number
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


export type UserPublic = Omit<User, 'password'>
