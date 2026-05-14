import { connect, TABLES, toCamelCase, toSnakeCase } from './supabase'
import type { User } from '../types'

export const usersModel = {
  async getAll(): Promise<User[]> {
    const db = connect()
    const { data, error } = await db.from(TABLES.USERS).select('*')
    if (error) throw error
    return data.map(toCamelCase) as User[]
  },

  async get(id: number): Promise<User | null> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return toCamelCase(data) as User
  },

  async getByEmail(email: string): Promise<User | null> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.USERS)
      .select('*')
      .ilike('email', email)
      .single()
    if (error) return null
    return toCamelCase(data) as User
  },

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.USERS)
      .insert(toSnakeCase(userData))
      .select()
      .single()
    if (error) throw error
    return toCamelCase(data) as User
  },

  async update(id: number, userData: Partial<Omit<User, 'id'>>): Promise<User | null> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.USERS)
      .update(toSnakeCase(userData))
      .eq('id', id)
      .select()
      .single()
    if (error) return null
    return toCamelCase(data) as User
  },

  async delete(id: number): Promise<boolean> {
    const db = connect()
    const { error } = await db.from(TABLES.USERS).delete().eq('id', id)
    if (error) return false
    return true
  },

  async emailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const db = connect()
    let query = db.from(TABLES.USERS).select('id').ilike('email', email)

    if (excludeUserId) {
      query = query.neq('id', excludeUserId)
    }

    const { data, error } = await query
    if (error) return false
    return data && data.length > 0
  },
}

export async function seed() {
  const db = connect()
  const usersData = [
    // Admins (2)
    { name: 'Joe Doe', email: 'joe@fittrack.com', password: 'admin123', role: 'admin', age: 30, height_cm: 180, weight_kg: 75 },
    { name: 'Admin Sarah', email: 'sarah@fittrack.com', password: 'admin123', role: 'admin', age: 28, height_cm: 165, weight_kg: 62 },
    
    // Members (13)
    { name: 'Dhyan Patel', email: 'dhyan@fittrack.com', password: 'user123', role: 'member', age: 25, height_cm: 178, weight_kg: 70 },
    { name: 'Sam Johnson', email: 'sam@fittrack.com', password: 'user123', role: 'member', age: 32, height_cm: 185, weight_kg: 82 },
    { name: 'Emma Wilson', email: 'emma@fittrack.com', password: 'user123', role: 'member', age: 27, height_cm: 168, weight_kg: 60 },
    { name: 'Michael Brown', email: 'michael@fittrack.com', password: 'user123', role: 'member', age: 35, height_cm: 182, weight_kg: 78 },
    { name: 'Lisa Garcia', email: 'lisa@fittrack.com', password: 'user123', role: 'member', age: 26, height_cm: 162, weight_kg: 58 },
    { name: 'David Lee', email: 'david@fittrack.com', password: 'user123', role: 'member', age: 29, height_cm: 175, weight_kg: 72 },
    { name: 'Jessica Martinez', email: 'jessica@fittrack.com', password: 'user123', role: 'member', age: 31, height_cm: 170, weight_kg: 65 },
    { name: 'Chris Anderson', email: 'chris@fittrack.com', password: 'user123', role: 'member', age: 24, height_cm: 180, weight_kg: 75 },
    { name: 'Rachel Taylor', email: 'rachel@fittrack.com', password: 'user123', role: 'member', age: 28, height_cm: 166, weight_kg: 61 },
    { name: 'James White', email: 'james@fittrack.com', password: 'user123', role: 'member', age: 33, height_cm: 183, weight_kg: 80 },
    { name: 'Olivia Harris', email: 'olivia@fittrack.com', password: 'user123', role: 'member', age: 26, height_cm: 167, weight_kg: 59 },
    { name: 'Kevin Clark', email: 'kevin@fittrack.com', password: 'user123', role: 'member', age: 30, height_cm: 179, weight_kg: 74 },
    { name: 'Sophia Rodriguez', email: 'sophia@fittrack.com', password: 'user123', role: 'member', age: 25, height_cm: 165, weight_kg: 57 },
  ]

  // Generate 50 additional members procedurally so we have plenty of users for
  // the infinite-scroll demo. They use predictable emails: user1@fittrack.com .. user50@fittrack.com
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Parker', 'Drew',
    'Skyler', 'Reese', 'Hayden', 'Cameron', 'Rowan', 'Sage', 'Blake', 'Logan', 'Peyton', 'Emerson',
    'Finley', 'Harper', 'Jamie', 'Kendall', 'Lane', 'Micah', 'Nico', 'Oakley', 'Phoenix', 'River',
    'Shawn', 'Tatum', 'Quincy', 'Remy', 'Sloan', 'Tyler', 'Aiden', 'Bella', 'Carter', 'Dakota',
    'Ethan', 'Faith', 'Grace', 'Hunter', 'Iris', 'Jade', 'Kira', 'Leo', 'Maya', 'Nora',
  ]
  const lastNames = [
    'Adams', 'Baker', 'Carter', 'Davis', 'Evans', 'Foster', 'Green', 'Hill', 'Irwin', 'Jones',
    'King', 'Lewis', 'Mason', 'Nguyen', 'Owens', 'Price', 'Quinn', 'Reed', 'Smith', 'Turner',
    'Underwood', 'Vance', 'Walker', 'Xu', 'Young', 'Zimmer', 'Bell', 'Cruz', 'Dean', 'Ellis',
    'Fox', 'Grant', 'Hayes', 'Ingram', 'Jensen', 'Kim', 'Lopez', 'Mills', 'Nash', 'Ortiz',
    'Patel', 'Quintero', 'Reyes', 'Stone', 'Tran', 'Vargas', 'Watts', 'York', 'Zane', 'Pine',
  ]

  for (let i = 0; i < 50; i++) {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[i % lastNames.length]
    usersData.push({
      name: `${first} ${last}`,
      email: `user${i + 1}@fittrack.com`,
      password: 'user123',
      role: 'member',
      age: 20 + (i % 30), // 20..49
      height_cm: 155 + (i % 35), // 155..189
      weight_kg: 50 + (i % 45), // 50..94
    })
  }

  const { error, data } = await db.from(TABLES.USERS).insert(usersData).select()
  if (error) {
    throw error
  }
  const count = data?.length || usersData.length
  console.log(`✓ Seeded ${count} users`)
  return count
}
