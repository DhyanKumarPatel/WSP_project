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
  <section class="login-page">
    <div class="login-wrapper">
      <div class="brand-panel">
        <div class="brand-content">
          <span class="brand-badge">Fitness Tracker</span>
          <h1>Track workouts, monitor progress, and stay connected.</h1>
          <p>
            A polished fitness tracker app with role-based access, personal
            activity logs, friend activity viewing, admin controls, and helpful
            statistics.
          </p>

          <div class="demo-users">
            <h3>Demo Accounts</h3>
            <div class="demo-user-card">
              <strong>Admin</strong>
              <span>user_1@fittrack.com / admin123</span>
            </div>
            <div class="demo-user-card">
              <strong>Member</strong>
              <span>dhyan@fittrack.com / user123</span>
            </div>
            <div class="demo-user-card">
              <strong>Member</strong>
              <span>user_3@fittrack.com / user123</span>
            </div>
          </div>
        </div>
      </div>

      <div class="login-panel">
        <div class="login-card">
          <div class="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your fitness dashboard.</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>

            <button type="submit" class="login-button">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>



<style scoped>
.login-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(99, 102, 241, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.16), transparent 30%),
    linear-gradient(135deg, #0f172a, #111827 45%, #1e293b);
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 2rem;
}

.login-wrapper {
  width: 100%;
  max-width: 1280px;
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  border-radius: 28px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
}

.brand-panel {
  padding: 4rem;
  color: white;
  display: flex;
  align-items: center;
}

.brand-content {
  max-width: 560px;
}

.brand-badge {
  display: inline-block;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 1.5rem;
}

.brand-content h1 {
  font-size: 3rem;
  line-height: 1.1;
  margin-bottom: 1rem;
  font-weight: 800;
}

.brand-content p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.demo-users h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.demo-user-card {
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem 1.1rem;
  margin-bottom: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.demo-user-card span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.login-panel {
  background: rgba(255, 255, 255, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.login-card {
  width: 100%;
  max-width: 430px;
}

.login-header {
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  color: #111827;
}

.login-header p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input {
  height: 52px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  padding: 0 1rem;
  font-size: 0.98rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
}

.error-message {
  margin: 0;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.94rem;
}

.login-button {
  height: 54px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(79, 70, 229, 0.24);
}

.login-button:active {
  transform: translateY(0);
}

@media (max-width: 960px) {
  .login-wrapper {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    padding: 2.5rem;
  }

  .brand-content h1 {
    font-size: 2.2rem;
  }

  .login-panel {
    padding: 2rem;
  }
}
</style>