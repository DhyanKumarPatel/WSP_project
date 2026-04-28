
<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import type { Activity, ActivityType } from '@/types'

const props = defineProps<{
  activity: Activity | null
}>()

const emit = defineEmits<{
  save: [payload: Omit<Activity, 'id'> | Activity]
  cancel: []
}>()

const activityTypes: ActivityType[] = [
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Yoga',
  'Swimming',
]

const errorMessage = ref('')

const form = reactive({
  type: '' as ActivityType | '',
  durationMin: 0,
  calories: 0,
  date: '',
  notes: '',
})

const isEditing = computed(() => props.activity !== null)

watch(
  () => props.activity,
  (activity) => {
    if (activity) {
      form.type = activity.type
      form.durationMin = activity.durationMin
      form.calories = activity.calories
      form.date = activity.date
      form.notes = activity.notes || ''
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

function resetForm() {
  form.type = ''
  form.durationMin = 0
  form.calories = 0
  form.date = ''
  form.notes = ''
  errorMessage.value = ''
}

function handleSubmit() {
  errorMessage.value = ''

  if (!form.type || !form.date) {
    errorMessage.value = 'Please complete all required fields.'
    return
  }

  if (form.durationMin <= 0) {
    errorMessage.value = 'Duration must be greater than 0.'
    return
  }

  if (form.calories <= 0) {
    errorMessage.value = 'Calories must be greater than 0.'
    return
  }

  if (props.activity) {
    emit('save', {
      id: props.activity.id,
      userId: props.activity.userId,
      type: form.type,
      durationMin: form.durationMin,
      calories: form.calories,
      date: form.date,
      notes: form.notes.trim(),
    })
  } else {
    emit('save', {
      userId: 0,
      type: form.type,
      durationMin: form.durationMin,
      calories: form.calories,
      date: form.date,
      notes: form.notes.trim(),
    })
  }

  if (!props.activity) {
    resetForm()
  }
}

function handleCancel() {
  emit('cancel')
  resetForm()
}
</script>

<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ isEditing ? 'Edit Activity' : 'Add New Activity' }}
      </p>
    </header>

    <div class="card-content">
      <form @submit.prevent="handleSubmit">
        <div class="columns is-multiline">
          <div class="column is-12-tablet is-6-desktop">
            <div class="field">
              <label class="label">Activity Type</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="form.type" required>
                    <option value="">Select activity type</option>
                    <option v-for="type in activityTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop">
            <div class="field">
              <label class="label">Date</label>
              <div class="control">
                <input
                  v-model="form.date"
                  class="input"
                  type="date"
                  required
                />
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop">
            <div class="field">
              <label class="label">Duration (minutes)</label>
              <div class="control">
                <input
                  v-model.number="form.durationMin"
                  class="input"
                  type="number"
                  min="1"
                  placeholder="Enter duration"
                  required
                />
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop">
            <div class="field">
              <label class="label">Calories Burned</label>
              <div class="control">
                <input
                  v-model.number="form.calories"
                  class="input"
                  type="number"
                  min="1"
                  placeholder="Enter calories burned"
                  required
                />
              </div>
            </div>
          </div>

          <div class="column is-12">
            <div class="field">
              <label class="label">Notes</label>
              <div class="control">
                <textarea
                  v-model="form.notes"
                  class="textarea"
                  rows="4"
                  placeholder="Add optional notes about this session"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="notification is-danger is-light">
          {{ errorMessage }}
        </div>

        <div class="buttons">
          <button type="submit" class="button is-link">
            {{ isEditing ? 'Update Activity' : 'Add Activity' }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            class="button is-light"
            @click="handleCancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
