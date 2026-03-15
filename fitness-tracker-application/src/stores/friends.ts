import { defineStore } from 'pinia'
import { ref } from 'vue'
import friendshipsData from '@/data/friendships.json'
import type { Friendship } from '@/types'
import { useUsersStore } from './users'
import { useActivitiesStore } from './activities'

export const useFriendsStore = defineStore('friends', () => {
  const friendships = ref<Friendship[]>(friendshipsData.friendships as Friendship[])

  function getFriendIds(userId: number) {
    return friendships.value
      .filter((friendship) => friendship.userId === userId)
      .map((friendship) => friendship.friendId)
  }

  function getFriendsOfUser(userId: number) {
    const usersStore = useUsersStore()
    const friendIds = getFriendIds(userId)

    return usersStore.users.filter((user) => friendIds.includes(user.id))
  }

  function getFriendActivities(userId: number) {
    const activitiesStore = useActivitiesStore()
    const friendIds = getFriendIds(userId)

    return activitiesStore.activities
      .filter((activity) => friendIds.includes(activity.userId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return {
    friendships,
    getFriendIds,
    getFriendsOfUser,
    getFriendActivities,
  }
})