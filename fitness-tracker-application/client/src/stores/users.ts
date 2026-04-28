import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { apiList, api } from '@/services/myFetch'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiList<User>('/users', undefined, {
        method: 'GET',
      })

      if (response.isSuccess) {
        users.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = 'Failed to fetch users: ' + (err instanceof Error ? err.message : 'Unknown error')
    } finally {
      isLoading.value = false
    }
  }

  function getUserById(id: number) {
    return users.value.find((user) => user.id === id) || null
  }

  async function addUser(newUser: Omit<User, 'id'>) {
    try {
      const response = await api<User>('/users', newUser, {
        method: 'POST',
      })

      if (response.isSuccess && response.data) {
        users.value.push(response.data)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to add user:', err)
      return false
    }
  }

  async function updateUser(updatedUser: User) {
    try {
      const response = await api<User>(`/users/${updatedUser.id}`, updatedUser, {
        method: 'PUT',
      })

      if (response.isSuccess) {
        const index = users.value.findIndex((user) => user.id === updatedUser.id)
        if (index !== -1) {
          users.value[index] = updatedUser
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to update user:', err)
      return false
    }
  }

  async function deleteUser(id: number) {
    try {
      const response = await api<null>(`/users/${id}`, undefined, {
        method: 'DELETE',
      })

      if (response.isSuccess) {
        users.value = users.value.filter((user) => user.id !== id)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to delete user:', err)
      return false
    }
  }

  function emailExists(email: string, excludeUserId?: number) {
    return users.value.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== excludeUserId,
    )
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    emailExists,
  }
})