<template>
  <section v-if="authStore.currentUser" class="dashboard-page">
    <div class="hero-card">
      <div class="hero-copy">
        <span class="hero-badge">
          {{ authStore.isAdmin ? 'Admin Dashboard' : 'Personal Dashboard' }}
        </span>
        <h1>Welcome back, {{ authStore.currentUser.name }}.</h1>
        <p>
          Track your fitness journey, monitor activity trends, connect with
          friends, and stay consistent with your routine.
        </p>

        <div class="hero-actions">
          <RouterLink to="/activities" class="hero-btn primary-btn">
            Manage Activities
          </RouterLink>
          <RouterLink to="/stats" class="hero-btn secondary-btn">
            View Statistics
          </RouterLink>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin/users"
            class="hero-btn admin-btn"
          >
            Open Admin Panel
          </RouterLink>
        </div>
      </div>

      <div class="hero-summary">
        <div class="summary-box">
          <span class="summary-label">Role</span>
          <strong>{{ authStore.isAdmin ? 'Administrator' : 'Member' }}</strong>
        </div>
        <div class="summary-box">
          <span class="summary-label">Email</span>
          <strong>{{ authStore.currentUser.email }}</strong>
        </div>
        <div class="summary-box">
          <span class="summary-label">Profile</span>
          <strong>
            {{ authStore.currentUser.heightCm ?? '--' }} cm /
            {{ authStore.currentUser.weightKg ?? '--' }} kg
          </strong>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <StatCard
        label="Total Activities"
        :value="statsStore.getTotalActivities(authStore.currentUser.id)"
        hint="Recorded workouts in your log"
      />
      <StatCard
        label="Total Duration"
        :value="`${statsStore.getTotalDuration(authStore.currentUser.id)} min`"
        hint="Combined time across all activities"
      />
      <StatCard
        label="Calories Burned"
        :value="statsStore.getTotalCalories(authStore.currentUser.id)"
        hint="Estimated calories from your history"
      />
      <StatCard
        label="Favorite Activity"
        :value="statsStore.getFavoriteActivity(authStore.currentUser.id)"
        hint="Most frequently logged activity"
      />
    </div>

    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="panel-header">
          <div>
            <h2>Recent Activities</h2>
            <p>Your latest logged workouts and exercise sessions.</p>
          </div>
          <RouterLink to="/activities" class="panel-link">
            View all
          </RouterLink>
        </div>

        <div v-if="recentActivities.length" class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-main">
              <div class="activity-type">{{ activity.type }}</div>
              <div class="activity-notes">
                {{ activity.notes || 'No notes added for this session.' }}
              </div>
            </div>

            <div class="activity-meta">
              <span>{{ activity.durationMin }} min</span>
              <span>{{ activity.calories }} cal</span>
              <span>{{ activity.date }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          No activities logged yet. Start by adding your first workout.
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <div>
            <h2>Quick Access</h2>
            <p>Jump into the most important areas of the application.</p>
          </div>
        </div>

        <div class="quick-links">
          <RouterLink to="/activities" class="quick-link-card">
            <strong>Activity Log</strong>
            <span>Add, update, and manage your workout records.</span>
          </RouterLink>

          <RouterLink to="/friends" class="quick-link-card">
            <strong>Friends Feed</strong>
            <span>See what your connected friends have been doing.</span>
          </RouterLink>

          <RouterLink to="/stats" class="quick-link-card">
            <strong>Statistics</strong>
            <span>Review trends, totals, and your favorite activities.</span>
          </RouterLink>

          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin/users"
            class="quick-link-card admin-quick-link"
          >
            <strong>User Management</strong>
            <span>Admin-only access to manage users and roles.</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatCard from '@/components/StatCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activities'
import { useStatsStore } from '@/stores/stats'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()
const statsStore = useStatsStore()

const recentActivities = computed(() => {
  if (!authStore.currentUser) {
    return []
  }

  return activitiesStore
    .getActivitiesByUser(authStore.currentUser.id)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-card {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  gap: 1.5rem;
  border-radius: 28px;
  padding: 2rem;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.16), transparent 28%),
    linear-gradient(135deg, #0f172a, #111827 50%, #1e293b);
  color: white;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.2);
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: rgba(255, 255, 255, 0.12);
}

.hero-copy h1 {
  font-size: 2.5rem;
  line-height: 1.1;
  margin: 0 0 0.85rem;
}

.hero-copy p {
  margin: 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.75;
  font-size: 1.02rem;
}

.hero-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
}

.hero-btn {
  text-decoration: none;
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  font-weight: 700;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.hero-btn:hover {
  transform: translateY(-1px);
}

.primary-btn {
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: white;
  box-shadow: 0 14px 28px rgba(79, 70, 229, 0.24);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.admin-btn {
  background: rgba(16, 185, 129, 0.18);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.hero-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-box {
  border-radius: 20px;
  padding: 1.15rem 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-box strong {
  font-size: 1rem;
  word-break: break-word;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.5rem;
}

.panel-card {
  background: white;
  border-radius: 24px;
  padding: 1.4rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.panel-header h2 {
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  color: #0f172a;
}

.panel-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.panel-link {
  text-decoration: none;
  color: #4f46e5;
  font-weight: 700;
  white-space: nowrap;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.activity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.activity-main {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.activity-type {
  font-weight: 800;
  color: #0f172a;
}

.activity-notes {
  color: #64748b;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
}

.activity-meta span {
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: white;
  border: 1px solid #e5e7eb;
  color: #334155;
  font-size: 0.88rem;
  font-weight: 700;
}

.quick-links {
  display: grid;
  gap: 0.9rem;
}

.quick-link-card {
  text-decoration: none;
  padding: 1rem 1rem;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e5e7eb;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.quick-link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.quick-link-card strong {
  display: block;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.quick-link-card span {
  color: #64748b;
  line-height: 1.55;
}

.admin-quick-link {
  background: linear-gradient(180deg, #ecfeff, #f0fdf4);
}

.empty-state {
  padding: 1.1rem;
  border-radius: 18px;
  background: #f8fafc;
  color: #64748b;
  border: 1px dashed #cbd5e1;
}

@media (max-width: 1180px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid,
  .hero-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .hero-card {
    padding: 1.4rem;
  }

  .hero-copy h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-meta {
    justify-content: flex-start;
  }
}
</style>