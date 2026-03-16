<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'

const authStore = useAuthStore()
const friendsStore = useFriendsStore()

const userId = computed(() => authStore.currentUser?.id ?? 0)

const friends = computed(() => friendsStore.getFriendsOfUser(userId.value))
const friendActivities = computed(() => friendsStore.getFriendActivities(userId.value))

function getUserName(userId: number) {
  return friends.value.find((u) => u.id === userId)?.name ?? 'Unknown User'
}
</script>

<template>
  <div v-if="authStore.currentUser">
    <section class="hero is-success is-small mb-5">
      <div class="hero-body">
        <p class="title">Friends</p>
        <p class="subtitle">View your friends and see their recent fitness activities.</p>
      </div>
    </section>

    <div class="columns">
      <div class="column is-4">
        <div class="columns is-multiline mb-1">
          <div class="column is-12">
            <StatCard label="Friends Count" :value="friends.length" />
          </div>
          <div class="column is-12">
            <StatCard label="Friend Activities" :value="friendActivities.length" />
          </div>
        </div>

        <!-- FriendList inlined -->
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Your Friends</p>
          </header>
          <div class="card-content">
            <div v-if="friends.length">
              <div v-for="friend in friends" :key="friend.id" class="box mb-3">
                <p><strong>{{ friend.name }}</strong></p>
                <p><small>{{ friend.email }}</small></p>
                <div class="tags mt-1">
                  <span class="tag is-success is-light">{{ friend.role }}</span>
                  <span class="tag is-info is-light">Age: {{ friend.age ?? '--' }}</span>
                </div>
              </div>
            </div>
            <div v-else class="notification is-light">No friends found.</div>
          </div>
        </div>
      </div>

      <div class="column is-8">
        <!-- FriendActivityFeed inlined -->
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Friends Activity Feed</p>
          </header>
          <div class="card-content">
            <div v-if="friendActivities.length">
              <div v-for="activity in friendActivities" :key="activity.id" class="box mb-3">
                <p>
                  <strong>{{ getUserName(activity.userId) }}</strong> logged
                  <strong>{{ activity.type }}</strong>
                </p>
                <p>{{ activity.notes || 'No notes added for this session.' }}</p>
                <div class="tags mt-1">
                  <span class="tag is-link is-light">{{ activity.durationMin }} min</span>
                  <span class="tag is-success is-light">{{ activity.calories }} cal</span>
                  <span class="tag is-light">{{ activity.date }}</span>
                </div>
              </div>
            </div>
            <div v-else class="notification is-light">No friend activities available yet.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>