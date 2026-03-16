<script setup lang="ts">
import { computed } from 'vue'
import ActivityTable from '@/components/ActivityTable.vue'
import StatCard from '@/components/StatCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const userId = computed(() => authStore.currentUser?.id ?? 0)

const userActivities = computed(() =>
  activitiesStore.getActivitiesByUser(userId.value)
)

const sortedActivities = computed(() =>
  userActivities.value
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

const recentActivities = computed(() => sortedActivities.value.slice(0, 6))

const totalActivities = computed(() => activitiesStore.getTotalActivities(userId.value))
const totalDuration = computed(() => activitiesStore.getTotalDuration(userId.value))
const totalCalories = computed(() => activitiesStore.getTotalCalories(userId.value))
const favoriteActivity = computed(() => activitiesStore.getFavoriteActivity(userId.value))

const averageDuration = computed(() => {
  if (!userActivities.value.length) return 0
  return Math.round(totalDuration.value / userActivities.value.length)
})

const averageCalories = computed(() => {
  if (!userActivities.value.length) return 0
  return Math.round(totalCalories.value / userActivities.value.length)
})

const mostRecentDate = computed(() =>
  sortedActivities.value[0]?.date ?? 'No activity yet'
)

const activityBreakdown = computed(() => {
  const counts: Record<string, number> = {}
  for (const activity of userActivities.value) {
    counts[activity.type] = (counts[activity.type] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
})

const maxBreakdownCount = computed(() =>
  activityBreakdown.value.length
    ? Math.max(...activityBreakdown.value.map((i) => i.count))
    : 1
)
</script>

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
        <StatCard label="Total Activities" :value="totalActivities" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard label="Total Duration" :value="`${totalDuration} min`" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard label="Calories Burned" :value="totalCalories" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard label="Favorite Activity" :value="favoriteActivity" />
      </div>
    </div>

    <div class="columns">
      <div class="column is-5">

        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Activity Breakdown</p>
          </header>
          <div class="card-content">
            <div v-if="activityBreakdown.length">
              <div v-for="item in activityBreakdown" :key="item.type" class="box mb-3">
                <div class="level is-mobile mb-2">
                  <div class="level-left">
                    <strong>{{ item.type }}</strong>
                  </div>
                  <div class="level-right">
                    <span class="tag is-link is-light">{{ item.count }} activities</span>
                  </div>
                </div>
                <progress
                  class="progress is-info"
                  :value="item.count"
                  :max="maxBreakdownCount"
                >
                  {{ item.count }}
                </progress>
              </div>
            </div>
            <div v-else class="notification is-light">No activity data available yet.</div>
          </div>
        </div>

      </div>

      <div class="column is-7">
        <div class="card mb-5">
          <header class="card-header">
            <p class="card-header-title">Performance Snapshot</p>
          </header>
          <div class="card-content">
            <div class="content">
              <p><strong>User:</strong> {{ authStore.currentUser.name }}</p>
              <p><strong>Email:</strong> {{ authStore.currentUser.email }}</p>
              <p><strong>Average Duration per Activity:</strong> {{ averageDuration }} min</p>
              <p><strong>Average Calories per Activity:</strong> {{ averageCalories }}</p>
              <p><strong>Most Recent Activity Date:</strong> {{ mostRecentDate }}</p>
            </div>
          </div>
        </div>

        <ActivityTable :activities="recentActivities" />
      </div>
    </div>
  </div>
</template>
