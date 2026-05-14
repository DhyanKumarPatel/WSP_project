import { connect, TABLES, toCamelCase, toSnakeCase } from './supabase'
import type { Friendship } from '../types'

export const friendsModel = {
  async getAll(): Promise<Friendship[]> {
    const db = connect()
    const { data, error } = await db.from(TABLES.FRIENDSHIPS).select('*')
    if (error) throw error
    return data.map(toCamelCase) as Friendship[]
  },

  async get(id: number): Promise<Friendship | null> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.FRIENDSHIPS)
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return toCamelCase(data) as Friendship
  },

  async getFriendshipsByUserId(userId: number): Promise<Friendship[]> {
    const db = connect()
    const { data, error } = await db.from(TABLES.FRIENDSHIPS).select('*').eq('user_id', userId)
    if (error) throw error
    return data.map(toCamelCase) as Friendship[]
  },

  async getFriendIds(userId: number): Promise<number[]> {
    const friendships = await this.getFriendshipsByUserId(userId)
    return friendships.map((f) => f.friendId)
  },

  async create(friendshipData: Omit<Friendship, 'id'>): Promise<Friendship> {
    const db = connect()
    const { data, error } = await db
      .from(TABLES.FRIENDSHIPS)
      .insert(toSnakeCase(friendshipData))
      .select()
      .single()
    if (error) throw error
    return toCamelCase(data) as Friendship
  },

  async delete(id: number): Promise<boolean> {
    const db = connect()
    const { error } = await db.from(TABLES.FRIENDSHIPS).delete().eq('id', id)
    if (error) return false
    return true
  },

  async removeFriendship(userId: number, friendId: number): Promise<boolean> {
    const db = connect()
    // Delete in either direction
    const { error: error1 } = await db
      .from(TABLES.FRIENDSHIPS)
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId)

    if (!error1) return true

    // Try the other direction
    const { error: error2 } = await db
      .from(TABLES.FRIENDSHIPS)
      .delete()
      .eq('user_id', friendId)
      .eq('friend_id', userId)

    return !error2
  },

  async isFriends(userId: number, friendId: number): Promise<boolean> {
    const db = connect()
    // Check if friendship exists in either direction
    const { data: data1 } = await db
      .from(TABLES.FRIENDSHIPS)
      .select('id')
      .eq('user_id', userId)
      .eq('friend_id', friendId)

    if (data1 && data1.length > 0) return true

    const { data: data2 } = await db
      .from(TABLES.FRIENDSHIPS)
      .select('id')
      .eq('user_id', friendId)
      .eq('friend_id', userId)

    return data2 ? data2.length > 0 : false
  },
}

export async function seed(userIds: number[]) {
  const db = connect()

  // Original named-user friendships (indexes 0..14)
  const friendshipPairs: Array<[number, number]> = [
    [userIds[0], userIds[2]], // Joe ↔ Dhyan
    [userIds[0], userIds[3]], // Joe ↔ Sam
    [userIds[2], userIds[4]], // Dhyan ↔ Emma
    [userIds[2], userIds[5]], // Dhyan ↔ Michael
    [userIds[3], userIds[6]], // Sam ↔ Lisa
    [userIds[4], userIds[5]], // Emma ↔ Michael
    [userIds[1], userIds[8]], // Sarah ↔ Chris
    [userIds[1], userIds[10]], // Sarah ↔ Rachel
    [userIds[5], userIds[7]], // Michael ↔ David
    [userIds[6], userIds[9]], // Lisa ↔ Jessica
    [userIds[7], userIds[11]], // David ↔ James
    [userIds[9], userIds[8]], // Jessica ↔ Chris
    [userIds[10], userIds[12]], // Rachel ↔ Olivia
    [userIds[11], userIds[13]], // James ↔ Kevin
    [userIds[12], userIds[14]], // Olivia ↔ Sophia
  ]

  // Wire every user (including the 50 procedurally generated ones at indexes 15..64)
  // to ~5-8 random other users so the friend activity feed has plenty to scroll through.
  const seenKey = new Set<string>(
    friendshipPairs.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`)),
  )

  const FRIENDS_PER_USER = 6
  for (let i = 0; i < userIds.length; i++) {
    const u = userIds[i]
    let attempts = 0
    let added = 0
    while (added < FRIENDS_PER_USER && attempts < FRIENDS_PER_USER * 4) {
      attempts++
      const j = Math.floor(Math.random() * userIds.length)
      if (j === i) continue
      const v = userIds[j]
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (seenKey.has(key)) continue
      seenKey.add(key)
      friendshipPairs.push([u, v])
      added++
    }
  }


  const friendshipsData: Array<{ user_id: number; friend_id: number }> = []
  friendshipPairs.forEach(([user1, user2]) => {
    friendshipsData.push({ user_id: user1, friend_id: user2 })
    friendshipsData.push({ user_id: user2, friend_id: user1 })
  })


  const CHUNK_SIZE = 500
  let inserted = 0
  for (let i = 0; i < friendshipsData.length; i += CHUNK_SIZE) {
    const chunk = friendshipsData.slice(i, i + CHUNK_SIZE)
    const { error, data } = await db.from(TABLES.FRIENDSHIPS).insert(chunk).select('id')
    if (error) throw error
    inserted += data?.length ?? chunk.length
  }

  console.log(`✓ Seeded ${inserted} friendship connections`)
  return inserted
}
