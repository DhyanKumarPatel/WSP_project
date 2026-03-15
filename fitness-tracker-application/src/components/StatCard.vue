<template>
  <div class="box stat-box">
    <p class="heading">{{ label }}</p>
    <p class="title is-4">{{ value }}</p>
    <p v-if="hint" class="has-text-grey">
      {{ hint }}
    </p>
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
}
</style>