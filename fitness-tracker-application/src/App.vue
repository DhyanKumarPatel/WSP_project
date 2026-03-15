<template>
  <div class="app-wrapper">
    <AppNavbar />
    <section class="section">
      <div class="container is-max-desktop">
        <RouterView />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/NavBar.vue'
</script>

<style scoped>
.app-wrapper {
  min-height: 600px;
  background-color: #f5f7fa;
}
</style>