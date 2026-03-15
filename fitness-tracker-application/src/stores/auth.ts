import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types'
import { useUsersStore } from './users'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(email: string, password: string) {
    const usersStore = useUsersStore()

    const foundUser = usersStore.users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password,
    )

    if (foundUser) {
      currentUser.value = foundUser
      return true
    }

    return false
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
})