import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Friendship, User, Activity } from '@/types'
import { apiList, api } from '@/services/myFetch'

export const useFriendsStore = defineStore('friends', () => {
  const friendships = ref<Friendship[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchFriendships() {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiList<Friendship>('/friends', undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        friendships.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = 'Failed to fetch friendships: ' + (err instanceof Error ? err.message : 'Unknown error')
    } finally {
      isLoading.value = false
    }
  }

  function getFriendIds(userId: number) {
    return friendships.value
      .filter((friendship) => friendship.userId === userId)
      .map((friendship) => friendship.friendId)
  }

  async function getFriendsOfUser(userId: number): Promise<User[]> {
    try {
      const response = await apiList<User>(`/friends/${userId}`, undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Failed to fetch friends:', err)
      return []
    }
  }

  async function getFriendActivities(userId: number): Promise<Activity[]> {
    try {
      const response = await apiList<Activity>(`/friends/${userId}/activities`, undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        return response.data
      }
      return []
    } catch (err) {
      console.error('Failed to fetch friend activities:', err)
      return []
    }
  }

  async function addFriend(userId: number, friendId: number): Promise<boolean> {
    try {
      const response = await api<Friendship>('/friends', { userId, friendId }, {
        method: 'POST',
      })

      if (response.isSuccess && response.data) {
        friendships.value.push(response.data)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to add friend:', err)
      return false
    }
  }

  async function removeFriend(userId: number, friendId: number): Promise<boolean> {
    try {
      const response = await api<null>(`/friends/${userId}/${friendId}`, undefined, {
        method: 'DELETE',
      })

      if (response.isSuccess) {
        friendships.value = friendships.value.filter(
          (f) => !(f.userId === userId && f.friendId === friendId),
        )
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to remove friend:', err)
      return false
    }
  }

  return {
    friendships,
    isLoading,
    error,
    fetchFriendships,
    getFriendIds,
    getFriendsOfUser,
    getFriendActivities,
    addFriend,
    removeFriend,
  }
})