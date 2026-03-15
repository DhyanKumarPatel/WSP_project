import { defineStore } from 'pinia'
import { ref } from 'vue'
import activitiesData from '@/data/activities.json'
import type { Activity } from '@/types'

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>(activitiesData.activities as Activity[])

  function getActivitiesByUser(userId: number) {
    return activities.value.filter((activity) => activity.userId === userId)
  }

  function getActivityById(id: number) {
    return activities.value.find((activity) => activity.id === id) || null
  }

  function addActivity(newActivity: Omit<Activity, 'id'>) {
    const nextId =
      activities.value.length > 0
        ? Math.max(...activities.value.map((activity) => activity.id)) + 1
        : 1

    activities.value.push({
      id: nextId,
      ...newActivity,
    })
  }

  function updateActivity(updatedActivity: Activity) {
    const index = activities.value.findIndex(
      (activity) => activity.id === updatedActivity.id,
    )

    if (index !== -1) {
      activities.value[index] = { ...updatedActivity }
    }
  }

  function deleteActivity(id: number) {
    activities.value = activities.value.filter((activity) => activity.id !== id)
  }

  return {
    activities,
    getActivitiesByUser,
    getActivityById,
    addActivity,
    updateActivity,
    deleteActivity,
  }
})