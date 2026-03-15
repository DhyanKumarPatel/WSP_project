<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ isEditing ? 'Edit User' : 'Add New User' }}
      </p>
    </header>

    <div class="card-content">
      <form @submit.prevent="handleSubmit">
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="field">
              <label class="label">Full Name</label>
              <div class="control">
                <input
                  v-model="form.name"
                  class="input"
                  type="text"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>
          </div>

          <div class="column is-12">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="form.email"
                  class="input"
                  type="email"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop">
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="form.password"
                  class="input"
                  type="text"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop">
            <div class="field">
              <label class="label">Role</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="form.role" required>
                    <option value="">Select role</option>
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-4-desktop">
            <div class="field">
              <label class="label">Age</label>
              <div class="control">
                <input
                  v-model.number="form.age"
                  class="input"
                  type="number"
                  min="1"
                  placeholder="Age"
                />
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-4-desktop">
            <div class="field">
              <label class="label">Height (cm)</label>
              <div class="control">
                <input
                  v-model.number="form.heightCm"
                  class="input"
                  type="number"
                  min="1"
                  placeholder="Height"
                />
              </div>
            </div>
          </div>

          <div class="column is-12-tablet is-4-desktop">
            <div class="field">
              <label class="label">Weight (kg)</label>
              <div class="control">
                <input
                  v-model.number="form.weightKg"
                  class="input"
                  type="number"
                  min="1"
                  placeholder="Weight"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="notification is-danger is-light">
          {{ errorMessage }}
        </div>

        <div class="buttons">
          <button type="submit" class="button is-warning">
            {{ isEditing ? 'Update User' : 'Add User' }}
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

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Role, User } from '@/types'

const props = defineProps<{
  user: User | null
  emailExists: (email: string, excludeUserId?: number) => boolean
}>()

const emit = defineEmits<{
  save: [payload: Omit<User, 'id'> | User]
  cancel: []
}>()

const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: '' as Role | '',
  age: undefined as number | undefined,
  heightCm: undefined as number | undefined,
  weightKg: undefined as number | undefined,
})

const isEditing = computed(() => props.user !== null)

watch(
  () => props.user,
  (user) => {
    if (user) {
      form.name = user.name
      form.email = user.email
      form.password = user.password
      form.role = user.role
      form.age = user.age
      form.heightCm = user.heightCm
      form.weightKg = user.weightKg
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

function resetForm() {
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = ''
  form.age = undefined
  form.heightCm = undefined
  form.weightKg = undefined
  errorMessage.value = ''
}

function handleSubmit() {
  errorMessage.value = ''

  if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.role) {
    errorMessage.value = 'Please complete all required fields.'
    return
  }

  if (props.emailExists(form.email, props.user?.id)) {
    errorMessage.value = 'A user with this email already exists.'
    return
  }

  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    password: form.password.trim(),
    role: form.role,
    age: form.age,
    heightCm: form.heightCm,
    weightKg: form.weightKg,
  }

  if (props.user) {
    emit('save', {
      id: props.user.id,
      ...payload,
    })
  } else {
    emit('save', payload)
    resetForm()
  }
}

function handleCancel() {
  emit('cancel')
  resetForm()
}
</script>