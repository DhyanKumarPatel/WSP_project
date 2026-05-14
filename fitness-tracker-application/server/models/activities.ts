import { connect, TABLES, toCamelCase, toSnakeCase } from './supabase'
import type { Activity } from '../types'

export const activitiesModel = {
  async getAll(): Promise<Activity[]> {
    const db = connect()
    const { data, error } = await db.from(TABLES.ACTIVITIES).select('*')
    if (error) throw error
    return data.map(toCamelCase) as Activity[]
  },

  async get(id: number): Promise<Activity | null> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.ACTIVITIES)
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return toCamelCase(data) as Activity
  },

  async getByUserId(userId: number): Promise<Activity[]> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.ACTIVITIES)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    if (error) throw error
    return data.map(toCamelCase) as Activity[]
  },

  async create(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.ACTIVITIES)
      .insert(toSnakeCase(activityData))
      .select()
      .single()
    if (error) throw error
    return toCamelCase(data) as Activity
  },

  async update(id: number, activityData: Partial<Omit<Activity, 'id'>>): Promise<Activity | null> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.ACTIVITIES)
      .update(toSnakeCase(activityData))
      .eq('id', id)
      .select()
      .single()
    if (error) return null
    return toCamelCase(data) as Activity
  },

  async delete(id: number): Promise<boolean> {
    const db = connect()
    const { error } = await db.from(TABLES.ACTIVITIES).delete().eq('id', id)
    if (error) return false
    return true
  },

  async getStatsByUserId(
    userId: number,
  ): Promise<{
    totalActivities: number
    totalDuration: number
    totalCalories: number
  }> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.ACTIVITIES)
      .select('duration_min, calories')
      .eq('user_id', userId)

    if (error) {
      return {
        totalActivities: 0,
        totalDuration: 0,
        totalCalories: 0,
      }
    }

    const activities = data as Array<{ duration_min: number; calories: number }>

    return {
      totalActivities: activities.length,
      totalDuration: activities.reduce((sum, a) => sum + a.duration_min, 0),
      totalCalories: activities.reduce((sum, a) => sum + a.calories, 0),
    }
  },


  async getByUserIdsPaged(
    userIds: number[],
    limit: number,
    offset: number,
  ): Promise<{ items: Activity[]; total: number }> {
    if (userIds.length === 0) {
      return { items: [], total: 0 }
    }

    const db = connect()
    const { data, error, count } = await db
      .from(TABLES.ACTIVITIES)
      .select('*', { count: 'exact' })
      .in('user_id', userIds)
      .order('date', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      items: (data ?? []).map(toCamelCase) as Activity[],
      total: count ?? 0,
    }
  },
}

export async function seed(userIds: number[]) {
  const db = connect()
  const activityTypes = ['Running', 'Walking', 'Cycling', 'Gym', 'Yoga', 'Swimming']
  const activitiesData: Array<{
    user_id: number
    type: string
    date: string
    duration_min: number
    calories: number
    notes: string
  }> = []

 
  const DAYS = 180
  const MAX_PER_USER_PER_DAY = 3
  const today = new Date()

  for (let i = 0; i < DAYS; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    userIds.forEach((userId) => {
      const activitiesToday = Math.floor(Math.random() * (MAX_PER_USER_PER_DAY + 1)) // 0..3
      for (let j = 0; j < activitiesToday; j++) {
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
        const duration = Math.floor(Math.random() * 60) + 15 // 15-75 minutes
        const calories = Math.floor(duration * 7 + Math.random() * 50)

        activitiesData.push({
          user_id: userId,
          type,
          date: dateStr,
          duration_min: duration,
          calories,
          notes: `${type} session on ${new Date(dateStr).toLocaleDateString()}`,
        })
      }
    })
  }

  if (activitiesData.length === 0) return 0


  const CHUNK_SIZE = 500
  let inserted = 0
  for (let i = 0; i < activitiesData.length; i += CHUNK_SIZE) {
    const chunk = activitiesData.slice(i, i + CHUNK_SIZE)
    const { error, data } = await db.from(TABLES.ACTIVITIES).insert(chunk).select('id')
    if (error) throw error
    inserted += data?.length ?? chunk.length
  }

  console.log(`✓ Seeded ${inserted} activities across the past ${DAYS} days`)
  return inserted
}
