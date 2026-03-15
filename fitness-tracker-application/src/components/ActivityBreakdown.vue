<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Activity Breakdown</p>
    </header>

    <div class="card-content">
      <div v-if="breakdown.length">
        <div
          v-for="item in breakdown"
          :key="item.type"
          class="box mb-3"
        >
          <div class="level is-mobile mb-2">
            <div class="level-left">
              <div class="level-item">
                <strong>{{ item.type }}</strong>
              </div>
            </div>

            <div class="level-right">
              <div class="level-item">
                <span class="tag is-link is-light">
                  {{ item.count }} activities
                </span>
              </div>
            </div>
          </div>

          <progress
            class="progress is-info"
            :value="item.count"
            :max="maxCount"
          >
            {{ item.count }}
          </progress>
        </div>
      </div>

      <div v-else class="notification is-light">
        No activity data available yet.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type BreakdownItem = {
  type: string
  count: number
}

const props = defineProps<{
  breakdown: BreakdownItem[]
}>()

const maxCount = computed(() => {
  if (!props.breakdown.length) {
    return 1
  }

  return Math.max(...props.breakdown.map((item) => item.count))
})
</script>