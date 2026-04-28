
import { config } from "dotenv"
config()

import { seed as seedUsers } from "./users"
import { seed as seedActivities } from "./activities"
import { seed as seedFriendships } from "./friends"
import { connect, TABLES } from "./supabase"

async function seedDatabase() {
  try {
    const db = connect()

    console.log(' Starting database seeding...\n')

    // Clear existing data
    console.log('Clearing existing data...')
    await db.from(TABLES.FRIENDSHIPS).delete().neq('id', 0)
    await db.from(TABLES.ACTIVITIES).delete().neq('id', 0)
    await db.from(TABLES.USERS).delete().neq('id', 0)
    console.log('✓ Tables cleared\n')

    // Seed users
    console.log('Seeding users...')
    await seedUsers()

    // Get user IDs for friendships and activities
    const { data: users, error: usersError } = await db
      .from(TABLES.USERS)
      .select('id')
    if (usersError) throw usersError
    const userIds = users.map((u: { id: number }) => u.id)

    // Seed friendships
    console.log('Seeding friendships...')
    await seedFriendships(userIds)

    // Seed activities
    console.log('Seeding activities...')
    await seedActivities(userIds)

    console.log('\n🎉 Database seeding complete!')
  } catch (error) {
    console.error(' Seeding failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

seedDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error("Error seeding data:", err)
    process.exit(1)
  })
