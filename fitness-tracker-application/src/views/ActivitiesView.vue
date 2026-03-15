<template>
  <div v-if="authStore.currentUser">
    <section class="hero is-info is-small mb-5">
      <div class="hero-body">
        <p class="title">Activity Log</p>
        <p class="subtitle">
          Add, edit, and manage your personal fitness activities.
        </p>
      </div>
    </section>

    <div class="columns">
      <div class="column is-5">
        <ActivityForm
          :activity="selectedActivity"
          @save="handleSaveActivity"
          @cancel="handleCancelEdit"
        />
      </div>

      <div class="column is-7">
        <div class="columns is-multiline mb-1">
          <div class="column is-12-mobile is-4-tablet">
            <div class="box has-text-centered">
              <p class="heading">Total Activities</p>
              <p class="title is-4">{{ userActivities.length }}</p>
            </div>
          </div>

          <div class="column is-12-mobile is-4-tablet">
            <div class="box has-text-centered">
              <p class="heading">Total Duration</p>
              <p class="title is-4">{{ totalDuration }} min</p>
            </div>
          </div>

          <div class="column is-12-mobile is-4-tablet">
            <div class="box has-text-centered">
              <p class="heading">Calories Burned</p>
              <p class="title is-4">{{ totalCalories }}</p>
            </div>
          </div>
        </div>

        <ActivityTable
          :activities="sortedActivities"
          @edit="handleEditActivity"
          @delete="handleDeleteActivity"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ActivityForm from '@/components/ActivityForm.vue'
import ActivityTable from '@/components/ActivityTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activities'
import type { Activity } from '@/types'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const selectedActivity = ref<Activity | null>(null)

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

const totalDuration = computed(() => {
  return userActivities.value.reduce(
    (total, activity) => total + activity.durationMin,
    0,
  )
})

const totalCalories = computed(() => {
  return userActivities.value.reduce(
    (total, activity) => total + activity.calories,
    0,
  )
})

function handleSaveActivity(payload: Omit<Activity, 'id'> | Activity) {
  if (!authStore.currentUser) {
    return
  }

  if ('id' in payload) {
    activitiesStore.updateActivity(payload)
    selectedActivity.value = null
    return
  }

  activitiesStore.addActivity({
    ...payload,
    userId: authStore.currentUser.id,
  })
}

function handleEditActivity(activity: Activity) {
  selectedActivity.value = { ...activity }
}

function handleCancelEdit() {
  selectedActivity.value = null
}

function handleDeleteActivity(id: number) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this activity?',
  )

  if (!confirmed) {
    return
  }

  activitiesStore.deleteActivity(id)

  if (selectedActivity.value?.id === id) {
    selectedActivity.value = null
  }
}
</script>