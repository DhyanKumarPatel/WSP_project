import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUsersStore } from './users'

export const useAuthStore = defineStore('auth', () => {
  const currentUserId = ref<number | null>(null)

  const usersStore = useUsersStore()

  const currentUser = computed(() => {
    if (currentUserId.value === null) {
      return null
    }

    return usersStore.getUserById(currentUserId.value)
  })

  const isAuthenticated = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(email: string, password: string) {
    const foundUser = usersStore.users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password,
    )

    if (foundUser) {
      currentUserId.value = foundUser.id
      return true
    }

    return false
  }

  function logout() {
    currentUserId.value = null
  }

  return {
    currentUserId,
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
})