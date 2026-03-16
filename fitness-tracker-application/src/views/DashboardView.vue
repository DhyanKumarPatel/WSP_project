<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatCard from '@/components/StatCard.vue'
import ActivityTable from '@/components/ActivityTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const recentActivities = computed(() => {
  if (!authStore.currentUser) return []
  return activitiesStore
    .getActivitiesByUser(authStore.currentUser.id)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})
</script>

<template>
  <div v-if="authStore.currentUser">
    <section class="hero is-link is-small mb-5">
      <div class="hero-body">
        <p class="title">Welcome, {{ authStore.currentUser.name }}</p>
        <p class="subtitle">
          Manage your workouts, review your progress, and stay connected with your fitness community.
        </p>

        <div class="tags mt-3">
          <span class="tag is-info is-light">
            {{ authStore.isAdmin ? 'Administrator' : 'Member' }}
          </span>
          <span class="tag is-info is-light">
            {{ authStore.currentUser.email }}
          </span>
          <span class="tag is-warning is-light">
            Height: {{ authStore.currentUser.heightCm ?? '--' }} cm
          </span>
          <span class="tag is-success is-light">
            Weight: {{ authStore.currentUser.weightKg ?? '--' }} kg
          </span>
        </div>
      </div>
    </section>

    <div class="columns is-multiline">
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard
          label="Total Activities"
          :value="activitiesStore.getTotalActivities(authStore.currentUser.id)"
          hint="Total recorded workouts"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard
          label="Total Duration"
          :value="`${activitiesStore.getTotalDuration(authStore.currentUser.id)} min`"
          hint="Combined workout time"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard
          label="Calories Burned"
          :value="activitiesStore.getTotalCalories(authStore.currentUser.id)"
          hint="Estimated calories"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-desktop">
        <StatCard
          label="Favorite Activity"
          :value="activitiesStore.getFavoriteActivity(authStore.currentUser.id)"
          hint="Most frequent activity"
        />
      </div>
    </div>

    <div class="columns">
      <div class="column is-8">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Recent Activities</p>
            <RouterLink to="/activities" class="card-header-icon">
              View All
            </RouterLink>
          </header>

          <div class="card-content">
            
            <ActivityTable :activities="recentActivities" />
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="card mb-5">
          <header class="card-header">
            <p class="card-header-title">Quick Access</p>
          </header>

          <div class="card-content">
            <div class="buttons are-medium is-flex is-flex-direction-column">
              <RouterLink to="/activities" class="button is-link is-fullwidth">
                Manage Activities
              </RouterLink>
              <RouterLink to="/friends" class="button is-info is-fullwidth">
                Friends Feed
              </RouterLink>
              <RouterLink to="/stats" class="button is-success is-fullwidth">
                View Statistics
              </RouterLink>
              <RouterLink
                v-if="authStore.isAdmin"
                to="/admin/users"
                class="button is-warning is-fullwidth"
              >
                Admin Panel
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Profile Snapshot</p>
          </header>

          <div class="card-content">
            <div class="content">
              <p><strong>Name:</strong> {{ authStore.currentUser.name }}</p>
              <p><strong>Email:</strong> {{ authStore.currentUser.email }}</p>
              <p><strong>Role:</strong> {{ authStore.isAdmin ? 'Administrator' : 'Member' }}</p>
              <p><strong>Age:</strong> {{ authStore.currentUser.age ?? '--' }}</p>
              <p><strong>Height:</strong> {{ authStore.currentUser.heightCm ?? '--' }} cm</p>
              <p><strong>Weight:</strong> {{ authStore.currentUser.weightKg ?? '--' }} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
