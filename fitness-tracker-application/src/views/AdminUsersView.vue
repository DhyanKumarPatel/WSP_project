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
            <div class="box has-text-centered">
              <p class="heading">Total Users</p>
              <p class="title is-4">{{ usersStore.users.length }}</p>
            </div>
          </div>

          <div class="column is-12-mobile is-4-tablet">
            <div class="box has-text-centered">
              <p class="heading">Admins</p>
              <p class="title is-4">{{ adminCount }}</p>
            </div>
          </div>

          <div class="column is-12-mobile is-4-tablet">
            <div class="box has-text-centered">
              <p class="heading">Members</p>
              <p class="title is-4">{{ memberCount }}</p>
            </div>
          </div>
        </div>

        <UserTable
          :users="usersStore.users"
          @edit="handleEditUser"
          @delete="handleDeleteUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UserForm from '@/components/UserForm.vue'
import UserTable from '@/components/UserTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const selectedUser = ref<User | null>(null)

const adminCount = computed(() => {
  return usersStore.users.filter((user) => user.role === 'admin').length
})

const memberCount = computed(() => {
  return usersStore.users.filter((user) => user.role === 'member').length
})

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

  const confirmed = window.confirm(
    'Are you sure you want to delete this user?',
  )

  if (!confirmed) {
    return
  }

  usersStore.deleteUser(id)

  if (selectedUser.value?.id === id) {
    selectedUser.value = null
  }
}
</script>