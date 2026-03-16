<template>
  <div class="box stat-box">
    <p class="heading">{{ label }}</p>
    <p class="title is-4 mb-2">{{ value }}</p>
    <p v-if="hint" class="has-text-grey is-size-7">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
}>()
</script>

<style scoped>
.stat-box {
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
  border: 1px solid #e5e7eb;
}
</style>