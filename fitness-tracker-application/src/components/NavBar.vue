<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const isActive = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

watch(() => route.path, () => {
  isActive.value = false
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar is-dark app-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-inner">
        <div class="navbar-brand">
                <a class="navbar-item" href="https://bulma.io">
                    <img alt="Vue logo" width="30" height="30" src="@/assets/logo.svg" />

                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                   @click="isActive = !isActive" :class="{ 'is-active': isActive }"
                   data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
      <div class="navbar-brand">
        <RouterLink to="/dashboard" class="navbar-item has-text-weight-bold app-brand">
          FitTrack Pro
        </RouterLink>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isActive }">
        <div v-if="authStore.isAuthenticated" class="navbar-start">
          <RouterLink to="/dashboard" class="navbar-item" active-class="is-active">
            Dashboard
          </RouterLink>
          <RouterLink to="/activities" class="navbar-item" active-class="is-active">
            Activities
          </RouterLink>
          <RouterLink to="/friends" class="navbar-item" active-class="is-active">
            Friends
          </RouterLink>
          <RouterLink to="/stats" class="navbar-item" active-class="is-active">
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
            <div class="buttons">
              <span class="tag is-info is-light is-medium mr-3">
                 {{ authStore.currentUser.name }}
              </span>
              <span
                class="tag is-medium mr-3"
                :class="authStore.isAdmin ? 'is-danger is-light' : 'is-success is-light'"
              >
                {{ authStore.isAdmin ? 'Admin' : 'Member' }}
              </span>
              <button class="button is-danger is-light is-medium " @click="handleLogout">
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

<style scoped>
.app-navbar {
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 4rem;       
  padding-top: 0.75rem;    
  padding-bottom: 0.75rem; 
}

.navbar-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-brand {
  font-size: 1.5rem;
}

.navbar-item.is-active {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-radius: 6px;
}

@media (min-width: 1024px) {
  .navbar-menu {
    display: flex !important;
    flex-grow: 1;
  }

  .navbar-start {
    margin-left: 1rem;
  }

  .navbar-end {
    margin-left: auto;
  }
}
</style>