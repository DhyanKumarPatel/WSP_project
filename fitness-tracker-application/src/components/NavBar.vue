<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="container is-max-desktop">
      <div class="navbar-brand">
        <RouterLink to="/dashboard" class="navbar-item has-text-weight-bold">
          FitTrack Pro
        </RouterLink>

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isActive }"
          aria-label="menu"
          aria-expanded="false"
          @click="isActive = !isActive"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isActive }">
        <div v-if="authStore.isAuthenticated" class="navbar-start">
          <RouterLink
            to="/dashboard"
            class="navbar-item"
            active-class="is-active"
          >
            Dashboard
          </RouterLink>

          <RouterLink
            to="/activities"
            class="navbar-item"
            active-class="is-active"
          >
            Activities
          </RouterLink>

          <RouterLink
            to="/friends"
            class="navbar-item"
            active-class="is-active"
          >
            Friends
          </RouterLink>

          <RouterLink
            to="/stats"
            class="navbar-item"
            active-class="is-active"
          >
            Stats
          </RouterLink>

          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin/users"
            class="navbar-item"
            active-class="is-active"
          >
            Admin
          </RouterLink>
        </div>

        <div class="navbar-end">
          <div v-if="authStore.isAuthenticated && authStore.currentUser" class="navbar-item">
            <div class="buttons is-flex is-align-items-center">
              <span class="tag is-info is-light">
                {{ authStore.currentUser.name }}
              </span>

              <span class="tag" :class="authStore.isAdmin ? 'is-danger is-light' : 'is-success is-light'">
                {{ authStore.isAdmin ? 'Admin' : 'Member' }}
              </span>

              <button class="button is-light" @click="handleLogout">
                Logout
              </button>
            </div>
          </div>

          <div v-else class="navbar-item">
            <RouterLink to="/login" class="button is-primary">
              Login
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const isActive = ref(false)
const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  isActive.value = false
  router.push('/login')
}
</script>