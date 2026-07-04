<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">Welcome back, {{ firstName }}</h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Here's what's happening today</p>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Employees</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ dataStore.activeEmployees.length }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Pending Leaves</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ dataStore.pendingLeaves.length }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Payroll (June)</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">${{ dataStore.totalPayrollThisMonth.toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Departments</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ dataStore.departmentList.length }}</p>
      </div>
    </div>

    <!-- Panels -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

      <!-- Headcount by department -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <p class="text-sm font-medium text-zinc-900 dark:text-white mb-4">Headcount by department</p>
        <div class="space-y-3">
          <div v-for="dept in dataStore.departmentStats" :key="dept.department" class="flex items-center gap-3">
            <span class="text-xs text-zinc-500 dark:text-zinc-400 w-24 text-right truncate">{{ dept.department }}</span>
            <div class="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-600 rounded-full"
                :style="{ width: (dept.count / maxDeptCount * 100) + '%' }"
              ></div>
            </div>
            <span class="text-xs text-zinc-700 dark:text-zinc-300 font-medium w-4">{{ dept.count }}</span>
          </div>
        </div>
      </div>

      <!-- Recent leaves -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <p class="text-sm font-medium text-zinc-900 dark:text-white mb-4">Recent leave requests</p>
        <div class="space-y-3">
          <div v-for="leave in dataStore.recentLeaves" :key="leave.id" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs flex-shrink-0">
              {{ getInitials(leave.employeeName) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-zinc-900 dark:text-white truncate">{{ leave.employeeName }}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ leave.type }} · {{ leave.days }} day{{ leave.days > 1 ? 's' : '' }}</p>
            </div>
            <span :class="['text-xs px-2 py-1 rounded-md font-medium', statusClasses[leave.status]]">
              {{ leave.status }}
            </span>
          </div>
          <p v-if="dataStore.recentLeaves.length === 0" class="text-sm text-zinc-400 text-center py-4">No recent leave requests</p>
        </div>
      </div>

    </div>

    <!-- Announcements -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
      <p class="text-sm font-medium text-zinc-900 dark:text-white mb-4">Latest announcements</p>
      <div class="space-y-4">
        <div v-for="item in dataStore.recentAnnouncements" :key="item.id" class="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ item.title }}</p>
            <span v-if="item.priority === 'high'" class="text-xs px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">Important</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ item.content }}</p>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{{ item.author }} · {{ formatDate(item.date) }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useDataStore } from '../stores/data.js'

const authStore = useAuthStore()
const dataStore = useDataStore()

const firstName = computed(() => authStore.user?.name?.split(' ')[0] || '')

const maxDeptCount = computed(() =>
  Math.max(...dataStore.departmentStats.map(d => d.count), 1)
)

const statusClasses = {
  approved: 'bg-green-50 text-green-700',
  pending: 'bg-yellow-50 text-yellow-700',
  rejected: 'bg-red-50 text-red-700',
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>