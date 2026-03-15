<template>
  <div v-if="authStore.currentUser">
    <section class="hero is-primary is-small mb-5">
      <div class="hero-body">
        <p class="title">Activity Statistics</p>
        <p class="subtitle">
          Review your activity totals, workout trends, and recent performance.
        </p>
      </div>
    </section>

    <div class="columns is-multiline">
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <div class="box has-text-centered">
          <p class="heading">Total Activities</p>
          <p class="title is-4">{{ totalActivities }}</p>
        </div>
      </div>

      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <div class="box has-text-centered">
          <p class="heading">Total Duration</p>
          <p class="title is-4">{{ totalDuration }} min</p>
        </div>
      </div>

      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <div class="box has-text-centered">
          <p class="heading">Calories Burned</p>
          <p class="title is-4">{{ totalCalories }}</p>
        </div>
      </div>

      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <div class="box has-text-centered">
          <p class="heading">Favorite Activity</p>
          <p class="title is-4">{{ favoriteActivity }}</p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-5">
        <ActivityBreakdown :breakdown="activityBreakdown" />
      </div>

      <div class="column is-7">
        <div class="card mb-5">
          <header class="card-header">
            <p class="card-header-title">Performance Snapshot</p>
          </header>

          <div class="card-content">
            <div class="content">
              <p>
                <strong>User:</strong> {{ authStore.currentUser.name }}
              </p>
              <p>
                <strong>Email:</strong> {{ authStore.currentUser.email }}
              </p>
              <p>
                <strong>Average Duration per Activity:</strong>
                {{ averageDuration }} min
              </p>
              <p>
                <strong>Average Calories per Activity:</strong>
                {{ averageCalories }}
              </p>
              <p>
                <strong>Most Recent Activity Date:</strong>
                {{ mostRecentDate }}
              </p>
            </div>
          </div>
        </div>

        <RecentStatsTable :activities="recentActivities" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActivityBreakdown from '@/components/ActivityBreakdown.vue'
import RecentStatsTable from '@/components/RecentStatsTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activities'
import { useStatsStore } from '@/stores/stats'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()
const statsStore = useStatsStore()

const userActivities = computed(() => {
  if (!authStore.currentUser) {
    return []
  }

  return activitiesStore.getActivitiesByUser(authStore.currentUser.id)
})

const sortedActivities = computed(() => {
  return userActivities.value
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const recentActivities = computed(() => {
  return sortedActivities.value.slice(0, 6)
})

const totalActivities = computed(() => {
  if (!authStore.currentUser) {
    return 0
  }

  return statsStore.getTotalActivities(authStore.currentUser.id)
})

const totalDuration = computed(() => {
  if (!authStore.currentUser) {
    return 0
  }

  return statsStore.getTotalDuration(authStore.currentUser.id)
})

const totalCalories = computed(() => {
  if (!authStore.currentUser) {
    return 0
  }

  return statsStore.getTotalCalories(authStore.currentUser.id)
})

const favoriteActivity = computed(() => {
  if (!authStore.currentUser) {
    return 'No activities yet'
  }

  return statsStore.getFavoriteActivity(authStore.currentUser.id)
})

const averageDuration = computed(() => {
  if (!userActivities.value.length) {
    return 0
  }

  return Math.round(totalDuration.value / userActivities.value.length)
})

const averageCalories = computed(() => {
  if (!userActivities.value.length) {
    return 0
  }

  return Math.round(totalCalories.value / userActivities.value.length)
})

const mostRecentDate = computed(() => {
  const firstActivity = sortedActivities.value[0]

  if (!firstActivity) {
    return 'No activity yet'
  }

  return firstActivity.date
})

const activityBreakdown = computed(() => {
  const counts: Record<string, number> = {}

  for (const activity of userActivities.value) {
    counts[activity.type] = (counts[activity.type] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
})
</script>