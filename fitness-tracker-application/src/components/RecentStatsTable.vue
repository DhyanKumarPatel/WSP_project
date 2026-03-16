<script setup lang="ts">
import type { Activity } from '@/types'

defineProps<{
  activities: Activity[]
}>()
</script>

<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Recent Activity Summary</p>
    </header>

    <div class="card-content">
      <div v-if="activities.length" class="table-container">
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Calories</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="activity in activities" :key="activity.id">
              <td>{{ activity.date }}</td>
              <td>
                <span class="tag is-info is-light">
                  {{ activity.type }}
                </span>
              </td>
              <td>{{ activity.durationMin }} min</td>
              <td>{{ activity.calories }}</td>
              <td>{{ activity.notes || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="notification is-light">
        No recent activities available.
      </div>
    </div>
  </div>
</template>

