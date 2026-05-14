<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import StatCard from '@/components/StatCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import type { User } from '@/types'

const authStore = useAuthStore()
const friendsStore = useFriendsStore()

const friends = ref<User[]>([])
const userId = computed(() => authStore.currentUser?.id ?? 0)

// Scroll container for the infinite-scroll feed.
const feedEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (userId.value > 0) {
    friends.value = await friendsStore.getFriendsOfUser(userId.value)
    
    friendsStore.resetFeed(userId.value)
    await friendsStore.loadMoreFriendActivities(userId.value)
  }
})


useInfiniteScroll(
  feedEl,
  async () => {
    if (userId.value > 0) {
      await friendsStore.loadMoreFriendActivities(userId.value)
    }
  },
  {
    distance: 100,
    canLoadMore: () => friendsStore.feedHasMore && !friendsStore.feedLoading,
  },
)
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
            <StatCard label="Friend Activities" :value="friendsStore.feedTotal" />
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
        
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Friends Activity Feed</p>
            <p class="card-header-icon has-text-grey">
              Showing {{ friendsStore.feedItems.length }} of {{ friendsStore.feedTotal }}
            </p>
          </header>

          
          <div ref="feedEl" class="card-content feed-scroll">
            <!-- Empty state -->
            <div
              v-if="
                !friendsStore.feedItems.length &&
                !friendsStore.feedLoading &&
                !friendsStore.feedError
              "
              class="notification is-light"
            >
              No friend activities available yet.
            </div>

            <!-- Activity list -->
            <div
              v-for="activity in friendsStore.feedItems"
              :key="activity.id"
              class="box mb-3"
            >
              <p>
                <strong>{{ activity.userName }}</strong> logged
                <strong>{{ activity.type }}</strong>
              </p>
              <p>{{ activity.notes || 'No notes added for this session.' }}</p>
              <div class="tags mt-1">
                <span class="tag is-link is-light">{{ activity.durationMin }} min</span>
                <span class="tag is-success is-light">{{ activity.calories }} cal</span>
                <span class="tag is-light">{{ activity.date }}</span>
              </div>
            </div>

            
            <div v-if="friendsStore.feedLoading">
              <div v-for="n in 3" :key="`skel-${n}`" class="box mb-3">
                <p class="is-skeleton">Loading user name placeholder</p>
                <p class="is-skeleton">Loading activity notes placeholder text.</p>
                <div class="tags mt-1">
                  <span class="tag is-skeleton">000 min</span>
                  <span class="tag is-skeleton">000 cal</span>
                  <span class="tag is-skeleton">0000-00-00</span>
                </div>
              </div>
            </div>

            
            <div v-if="friendsStore.feedError" class="notification is-danger is-light">
              {{ friendsStore.feedError }}
            </div>

            <!-- End-of-list marker -->
            <p
              v-if="
                !friendsStore.feedHasMore &&
                friendsStore.feedItems.length > 0 &&
                !friendsStore.feedLoading
              "
              class="has-text-centered has-text-grey mt-4"
            >
              🏁 You've reached the end of the feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed-scroll {
  max-height: 70vh;
  overflow-y: auto;
}
</style>