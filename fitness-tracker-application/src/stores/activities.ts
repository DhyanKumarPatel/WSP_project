import { defineStore } from 'pinia'
import { ref } from 'vue'
import activitiesData from '@/data/activities.json'
import type { Activity } from '@/types'

export const useActivitiesStore = defineStore('activities', () => {

  const activities = ref<Activity[]>(activitiesData.activities as Activity[])


  function getActivitiesByUser(userId: number) {
    return activities.value.filter((a) => a.userId === userId)
  }

  function getActivityById(id: number) {
    return activities.value.find((a) => a.id === id) || null
  }

  function addActivity(newActivity: Omit<Activity, 'id'>) {
    const nextId =
      activities.value.length > 0
        ? Math.max(...activities.value.map((a) => a.id)) + 1
        : 1
    activities.value.push({ id: nextId, ...newActivity })
  }

  function updateActivity(updatedActivity: Activity) {
    const index = activities.value.findIndex((a) => a.id === updatedActivity.id)
    if (index !== -1) {
      activities.value[index] = { ...updatedActivity }
    }
  }

  function deleteActivity(id: number) {
    activities.value = activities.value.filter((a) => a.id !== id)
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
    getActivitiesByUser,
    getActivityById,
    addActivity,
    updateActivity,
    deleteActivity,
    getTotalActivities,
    getTotalDuration,
    getTotalCalories,
    getFavoriteActivity,
  }
})