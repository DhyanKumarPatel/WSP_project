import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:3000/api/v1'

export type DataEnvelope<T> = {
  data: T
  message: string
  isSuccess: boolean
}

export type DataListEnvelope<T> = {
  data: T[]
  message: string
  isSuccess: boolean
}

/**
 * Get authorization headers with JWT token
 */
function getAuthHeaders(): Record<string, string> {
  const authStore = useAuthStore()
  const token = authStore.getToken()

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  return {}
}

/**
 * Handle API errors including 401 (unauthorized)
 */
function handleApiError(status: number, message: string) {
  if (status === 401) {
    // Token expired or invalid
    const authStore = useAuthStore()
    authStore.logout()

    // Try to redirect to login
    try {
      const router = useRouter()
      router.push('/login')
    } catch (err) {
      // Router might not be available in all contexts
      window.location.href = '/login'
    }

    console.error('Authentication failed: ' + message)
  }
}

export async function api<T>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {},
): Promise<DataEnvelope<T>> {
  const url = `${API_ROOT}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  }

  if (data) {
    config.body = JSON.stringify(data)
    config.method = config.method || 'POST'
  }

  try {
    const response = await fetch(url, config)
    const result: DataEnvelope<T> = await response.json()

    if (!response.ok) {
      console.error(`API Error: ${result.message}`)
      handleApiError(response.status, result.message)
    }

    return result
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export async function apiList<T>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {},
): Promise<DataListEnvelope<T>> {
  const url = `${API_ROOT}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  }

  if (data) {
    config.body = JSON.stringify(data)
    config.method = config.method || 'POST'
  }

  try {
    const response = await fetch(url, config)
    const result: DataListEnvelope<T> = await response.json()

    if (!response.ok) {
      console.error(`API Error: ${result.message}`)
      handleApiError(response.status, result.message)
    }

    return result
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
