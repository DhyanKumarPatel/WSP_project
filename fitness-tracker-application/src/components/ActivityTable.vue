<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Your Activities</p>
    </header>

    <div class="card-content">
      <div v-if="activities.length" class="table-container">
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Calories</th>
              <th>Notes</th>
              <th class="has-text-centered">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="activity in activities" :key="activity.id">
              <td>
                <span class="tag is-link is-light">{{ activity.type }}</span>
              </td>
              <td>{{ activity.date }}</td>
              <td>{{ activity.durationMin }} min</td>
              <td>{{ activity.calories }}</td>
              <td>{{ activity.notes || '—' }}</td>
              <td class="has-text-centered">
                <div class="buttons is-centered">
                  <button
                    class="button is-small is-info is-light"
                    @click="$emit('edit', activity)"
                  >
                    Edit
                  </button>
                  <button
                    class="button is-small is-danger is-light"
                    @click="$emit('delete', activity.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="notification is-light">
        No activities available yet. Add your first workout above.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types'

defineProps<{
  activities: Activity[]
}>()

defineEmits<{
  edit: [activity: Activity]
  delete: [id: number]
}>()
</script>