<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Your Friends</p>
    </header>

    <div class="card-content">
      <div v-if="friends.length">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="box mb-3"
        >
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{ friend.name }}</strong>
                  <br />
                  <small>{{ friend.email }}</small>
                </p>
              </div>

              <div class="tags">
                <span class="tag is-success is-light">
                  {{ friend.role }}
                </span>
                <span class="tag is-info is-light">
                  Age: {{ friend.age ?? '--' }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="notification is-light">
        No friends found for this user.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types'

defineProps<{
  friends: User[]
}>()
</script>