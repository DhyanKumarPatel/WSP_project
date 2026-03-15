import { defineStore } from 'pinia'
import { useActivitiesStore } from './activities'

export const useStatsStore = defineStore('stats', () => {
  const activitiesStore = useActivitiesStore()

  function getTotalActivities(userId: number) {
    return activitiesStore.getActivitiesByUser(userId).length
  }

  function getTotalDuration(userId: number) {
    return activitiesStore
      .getActivitiesByUser(userId)
      .reduce((total, activity) => total + activity.durationMin, 0)
  }

  function getTotalCalories(userId: number) {
    return activitiesStore
      .getActivitiesByUser(userId)
      .reduce((total, activity) => total + activity.calories, 0)
  }

  function getFavoriteActivity(userId: number) {
    const userActivities = activitiesStore.getActivitiesByUser(userId)

    if (userActivities.length === 0) {
      return 'No activities yet'
    }

    const counts: Record<string, number> = {}

    for (const activity of userActivities) {
      counts[activity.type] = (counts[activity.type] ?? 0) + 1
    }

    let favorite = ''
    let maxCount = 0

    for (const type in counts) {
      const count = counts[type] ?? 0

      if (count > maxCount) {
        maxCount = count
        favorite = type
      }
    }

    return favorite
  }

  return {
    getTotalActivities,
    getTotalDuration,
    getTotalCalories,
    getFavoriteActivity,
  }
})