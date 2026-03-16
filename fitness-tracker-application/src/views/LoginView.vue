<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

function handleLogin() {
  errorMessage.value = ''

  const success = authStore.login(email.value, password.value)

  if (!success) {
    errorMessage.value = 'Invalid email or password.'
    return
  }

  router.push('/dashboard')
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5">

          <h1 class="title has-text-centered">FitTrack Pro</h1>
          <p class="subtitle has-text-centered">Sign in to your account</p>

          <div class="card">
            <div class="card-content">

              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    v-model="email"
                    class="input"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input
                    v-model="password"
                    class="input"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <p v-if="errorMessage" class="has-text-danger mb-3">
                {{ errorMessage }}
              </p>

              <button class="button is-link is-fullwidth" @click="handleLogin">
                Sign In
              </button>

            </div>
          </div>

          <div class="box mt-4">
            <p class="heading mb-2">Demo Accounts</p>
            <p class="is-size-7"><strong>Admin:</strong> joe@fittrack.com / admin123</p>
            <p class="is-size-7"><strong>Member:</strong> dhyan@fittrack.com / user123</p>
            <p class="is-size-7"><strong>Member:</strong> sam@fittrack.com / user123</p>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>