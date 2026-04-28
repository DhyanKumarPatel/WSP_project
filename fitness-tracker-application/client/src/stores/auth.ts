import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types'
import { api } from '@/services/myFetch'

// Token storage keys
const TOKEN_KEY = 'fittrack_auth_token'
const USER_KEY = 'fittrack_auth_user'

interface LoginResponse {
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null && token.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  /**
   * Initialize auth state from localStorage (on app load)
   */
  function initializeAuth() {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        currentUser.value = JSON.parse(storedUser)
      } catch (err) {
        // Clear invalid data
        clearAuth()
      }
    }
  }

  /**
   * Store auth data in localStorage
   */
  function storeAuth(authToken: string, user: User) {
    token.value = authToken
    currentUser.value = user
    localStorage.setItem(TOKEN_KEY, authToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  /**
   * Clear auth data from memory and localStorage
   */
  function clearAuth() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  /**
   * Get current auth token
   */
  function getToken(): string | null {
    return token.value
  }

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api<LoginResponse>('/auth/login', { email, password }, {
        method: 'POST',
      })

      if (response.isSuccess && response.data) {
        const { user, token: authToken } = response.data
        storeAuth(authToken, user)
        return true
      } else {
        error.value = response.message
        return false
      }
    } catch (err) {
      error.value = 'Login failed: ' + (err instanceof Error ? err.message : 'Unknown error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    clearAuth()
    error.value = null
  }

  return {
    currentUser,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    initializeAuth,
    getToken,
    login,
    logout,
  }
})