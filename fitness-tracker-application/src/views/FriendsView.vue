<script setup lang="ts">
import { computed } from 'vue'
import FriendList from '@/components/FriendList.vue'
import FriendActivityFeed from '@/components/FriendActivityFeed.vue'
import StatCard from '@/components/StatCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'

const authStore = useAuthStore()
const friendsStore = useFriendsStore()

const friends = computed(() => {
  if (!authStore.currentUser) return []
  return friendsStore.getFriendsOfUser(authStore.currentUser.id)
})

const friendActivities = computed(() => {
  if (!authStore.currentUser) return []
  return friendsStore.getFriendActivities(authStore.currentUser.id)
})
</script>

<template>
  <div v-if="authStore.currentUser">
    <section class="hero is-success is-small mb-5">
      <div class="hero-body">
        <p class="title">Friends</p>
        <p class="subtitle">
          View your friends and see their recent fitness activities.
        </p>
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

        <FriendList :friends="friends" />
      </div>

      <div class="column is-8">
        <FriendActivityFeed
          :friends="friends"
          :activities="friendActivities"
        />
      </div>
    </div>
  </div>
</template>


