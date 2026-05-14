import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Friendship, User, FriendActivity } from '@/types'
import { apiList, api, apiPaginated } from '@/services/myFetch'

export const useFriendsStore = defineStore('friends', () => {
  const friendships = ref<Friendship[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // -----------------------------------------------------------------
  // Infinite-scroll friend activity feed state
  // -----------------------------------------------------------------
  const feedItems = ref<FriendActivity[]>([])
  const feedTotal = ref(0)
  const feedOffset = ref(0)
  const feedLimit = ref(20)
  const feedLoading = ref(false)
  const feedError = ref<string | null>(null)
  const feedHasMore = ref(true)
  // Track which user the current feed belongs to so we can detect stale state.
  const feedUserId = ref<number | null>(null)

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

  
  function resetFeed(userId: number | null = null, pageSize = 20) {
    feedItems.value = []
    feedTotal.value = 0
    feedOffset.value = 0
    feedLimit.value = pageSize
    feedHasMore.value = true
    feedLoading.value = false
    feedError.value = null
    feedUserId.value = userId
  }

 
  async function loadMoreFriendActivities(userId: number): Promise<void> {
    // If the requested user changed, start a fresh feed.
    if (feedUserId.value !== userId) {
      resetFeed(userId, feedLimit.value)
    }

    if (feedLoading.value || !feedHasMore.value) return

    feedLoading.value = true
    feedError.value = null

    try {
      const response = await apiPaginated<FriendActivity>(
        `/friends/${userId}/activities`,
        { limit: feedLimit.value, offset: feedOffset.value },
      )

      if (!response.isSuccess) {
        feedError.value = response.message
        feedHasMore.value = false
        return
      }

      feedItems.value.push(...response.data)
      feedTotal.value = response.total
      feedOffset.value += response.data.length
      feedHasMore.value =
        response.data.length === feedLimit.value && feedOffset.value < response.total
    } catch (err) {
      feedError.value =
        'Failed to load feed: ' + (err instanceof Error ? err.message : 'Unknown error')
      feedHasMore.value = false
    } finally {
      feedLoading.value = false
    }
  }

  return {
    friendships,
    isLoading,
    error,
    fetchFriendships,
    getFriendIds,
    getFriendsOfUser,
    addFriend,
    removeFriend,
    // Infinite-scroll feed
    feedItems,
    feedTotal,
    feedOffset,
    feedLimit,
    feedLoading,
    feedError,
    feedHasMore,
    feedUserId,
    resetFeed,
    loadMoreFriendActivities,
  }
})