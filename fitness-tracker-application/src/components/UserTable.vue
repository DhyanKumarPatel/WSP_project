<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">All Users</p>
    </header>

    <div class="card-content">
      <div v-if="users.length" class="table-container">
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Age</th>
              <th>Height</th>
              <th>Weight</th>
              <th class="has-text-centered">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span
                  class="tag"
                  :class="user.role === 'admin' ? 'is-danger is-light' : 'is-success is-light'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td>{{ user.age ?? '—' }}</td>
              <td>{{ user.heightCm ?? '—' }}</td>
              <td>{{ user.weightKg ?? '—' }}</td>
              <td class="has-text-centered">
                <div class="buttons is-centered">
                  <button
                    class="button is-small is-info is-light"
                    @click="$emit('edit', user)"
                  >
                    Edit
                  </button>
                  <button
                    class="button is-small is-danger is-light"
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

<script setup lang="ts">
import type { User } from '@/types'

defineProps<{
  users: User[]
}>()

defineEmits<{
  edit: [user: User]
  delete: [id: number]
}>()
</script>