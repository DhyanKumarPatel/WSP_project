<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Friends Activity Feed</p>
    </header>

    <div class="card-content">
      <div v-if="activities.length">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="box mb-3"
        >
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{ getUserName(activity.userId) }}</strong>
                  logged
                  <strong>{{ activity.type }}</strong>
                  <br />
                  {{ activity.notes || 'No notes added for this session.' }}
                </p>
              </div>

              <div class="tags">
                <span class="tag is-link is-light">
                  {{ activity.durationMin }} min
                </span>
                <span class="tag is-success is-light">
                  {{ activity.calories }} cal
                </span>
                <span class="tag is-light">
                  {{ activity.date }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="notification is-light">
        No friend activities available yet.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity, User } from '@/types'

const props = defineProps<{
  activities: Activity[]
  friends: User[]
}>()

function getUserName(userId: number) {
  const friend = props.friends.find((user) => user.id === userId)
  return friend?.name || 'Unknown User'
}
</script>