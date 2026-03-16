<script setup lang="ts">
import { computed, ref } from 'vue'
import UserForm from '@/components/UserForm.vue'
import StatCard from '@/components/StatCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const selectedUser = ref<User | null>(null)

const adminCount = computed(() =>
  usersStore.users.filter((u) => u.role === 'admin').length
)

const memberCount = computed(() =>
  usersStore.users.filter((u) => u.role === 'member').length
)

function handleSaveUser(payload: Omit<User, 'id'> | User) {
  if ('id' in payload) {
    usersStore.updateUser(payload)
    selectedUser.value = null
    return
  }
  usersStore.addUser(payload)
}

function handleEditUser(user: User) {
  selectedUser.value = { ...user }
}

function handleCancelEdit() {
  selectedUser.value = null
}

function handleDeleteUser(id: number) {
  if (authStore.currentUser?.id === id) {
    window.alert('You cannot delete the currently logged-in admin user.')
    return
  }
  if (!window.confirm('Are you sure you want to delete this user?')) return
  usersStore.deleteUser(id)
  if (selectedUser.value?.id === id) selectedUser.value = null
}
</script>

<template>
  <div v-if="authStore.currentUser">
    <section class="hero is-warning is-small mb-5">
      <div class="hero-body">
        <p class="title">Admin User Management</p>
        <p class="subtitle">
          Add, edit, and delete users. This area is accessible only to administrators.
        </p>
      </div>
    </section>

    <div class="columns">
      <div class="column is-5">
        <UserForm
          :user="selectedUser"
          :email-exists="usersStore.emailExists"
          @save="handleSaveUser"
          @cancel="handleCancelEdit"
        />
      </div>

      <div class="column is-7">
        <div class="columns is-multiline mb-1">
          <div class="column is-12-mobile is-4-tablet">
            <StatCard label="Total Users" :value="usersStore.users.length" />
          </div>
          <div class="column is-12-mobile is-4-tablet">
            <StatCard label="Admins" :value="adminCount" />
          </div>
          <div class="column is-12-mobile is-4-tablet">
            <StatCard label="Members" :value="memberCount" />
          </div>
        </div>

        <!-- UserTable inlined -->
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">All Users</p>
          </header>
          <div class="card-content">
            <div v-if="usersStore.users.length" class="table-container">
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
                  <tr v-for="user in usersStore.users" :key="user.id">
                    <td>
                      <p class="has-text-weight-semibold mb-1">{{ user.name }}</p>
                      <p class="is-size-7 has-text-grey">{{ user.email }}</p>
                    </td>
                    <td>
                      <span
                        class="tag"
                        :class="user.role === 'admin' ? 'is-danger is-light' : 'is-success is-light'"
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
                        <button class="button is-info is-light" @click="handleEditUser(user)">
                          Edit
                        </button>
                        <button class="button is-danger is-light" @click="handleDeleteUser(user.id)">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="notification is-light">No users available.</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>