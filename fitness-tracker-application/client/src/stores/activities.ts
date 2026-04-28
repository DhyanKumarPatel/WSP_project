import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity } from '@/types'
import { apiList, api } from '@/services/myFetch'

export type ActivityStats = {
  totalActivities: number
  totalDuration: number
  totalCalories: number
}

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActivities() {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiList<Activity>('/activities', undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        activities.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = 'Failed to fetch activities: ' + (err instanceof Error ? err.message : 'Unknown error')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserActivities(userId: number) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiList<Activity>(`/activities/user/${userId}`, undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        activities.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = 'Failed to fetch user activities: ' + (err instanceof Error ? err.message : 'Unknown error')
    } finally {
      isLoading.value = false
    }
  }

  function getActivitiesByUser(userId: number) {
    return activities.value.filter((a) => a.userId === userId)
  }

  function getActivityById(id: number) {
    return activities.value.find((a) => a.id === id) || null
  }

  async function addActivity(newActivity: Omit<Activity, 'id'>) {
    try {
      const response = await api<Activity>('/activities', newActivity, {
        method: 'POST',
      })

      if (response.isSuccess && response.data) {
        activities.value.push(response.data)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to add activity:', err)
      return false
    }
  }

  async function updateActivity(updatedActivity: Activity) {
    try {
      const response = await api<Activity>(`/activities/${updatedActivity.id}`, updatedActivity, {
        method: 'PUT',
      })

      if (response.isSuccess) {
        const index = activities.value.findIndex((a) => a.id === updatedActivity.id)
        if (index !== -1) {
          activities.value[index] = updatedActivity
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to update activity:', err)
      return false
    }
  }

  async function deleteActivity(id: number) {
    try {
      const response = await api<null>(`/activities/${id}`, undefined, {
        method: 'DELETE',
      })

      if (response.isSuccess) {
        activities.value = activities.value.filter((a) => a.id !== id)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to delete activity:', err)
      return false
    }
  }

  async function getStats(userId: number): Promise<ActivityStats | null> {
    try {
      const response = await api<ActivityStats>(`/activities/stats/${userId}`, undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        return response.data
      }
      return null
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      return null
    }
  }

  function getTotalActivities(userId: number) {
    return getActivitiesByUser(userId).length
  }

  function getTotalDuration(userId: number) {
    return getActivitiesByUser(userId)
      .reduce((total, a) => total + a.durationMin, 0)
  }

  function getTotalCalories(userId: number) {
    return getActivitiesByUser(userId)
      .reduce((total, a) => total + a.calories, 0)
  }

  function getFavoriteActivity(userId: number) {
    const list = getActivitiesByUser(userId)
    if (!list.length) return 'No activities yet'

    const counts: Record<string, number> = {}
    for (const a of list) {
      counts[a.type] = (counts[a.type] ?? 0) + 1
    }

    return Object.entries(counts)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] ?? 'No activities yet'
  }

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    fetchUserActivities,
    getActivitiesByUser,
    getActivityById,
    addActivity,
    updateActivity,
    deleteActivity,
    getStats,
    getTotalActivities,
    getTotalDuration,
    getTotalCalories,
    getFavoriteActivity,
  }
})