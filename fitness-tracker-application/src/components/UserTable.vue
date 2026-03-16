<script setup lang="ts">
import type { User } from '../types'

defineProps<{
  users: User[]
}>()

defineEmits<{
  edit: [user: User]
  delete: [id: number]
}>()
</script>

<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">All Users</p>
    </header>

    <div class="card-content">
      <div v-if="users.length" class="table-container">
        <table class="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Profile</th>
              <th class="has-text-centered">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <p class="has-text-weight-semibold mb-1">{{ user.name }}</p>
                <p class="is-size-7 has-text-grey">{{ user.email }}</p>
              </td>

              <td>
                <span
                  class="tag"
                  :class="
                    user.role === 'admin'
                      ? 'is-danger is-light'
                      : 'is-success is-light'
                  "
                >
                  {{ user.role }}
                </span>
              </td>

              <td>
                <p class="is-size-7 mb-1"><strong>Age:</strong> {{ user.age ?? '—' }}</p>
                <p class="is-size-7 mb-1"><strong>Height:</strong> {{ user.heightCm ?? '—' }} cm</p>
                <p class="is-size-7"><strong>Weight:</strong> {{ user.weightKg ?? '—' }} kg</p>
              </td>

              <td class="has-text-centered">
                <div class="buttons is-centered are-small">
                  <button
                    class="button is-info is-light"
                    @click="$emit('edit', user)"
                  >
                    Edit
                  </button>
                  <button
                    class="button is-danger is-light"
                    @click="$emit('delete', user.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="notification is-light">
        No users available.
      </div>
    </div>
  </div>
</template>

