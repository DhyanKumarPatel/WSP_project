<template>
  <div class="app-wrapper">
    <AppNavbar />
    <section class="section app-section">
      <div class="container is-fluid app-container">
        <RouterView />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/NavBar.vue'

// Initialize authentication from localStorage
const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom, #000000, #eef2f7);
}

.app-section {
  padding: 2rem 1.25rem 3rem;
}

.app-container {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
</style>