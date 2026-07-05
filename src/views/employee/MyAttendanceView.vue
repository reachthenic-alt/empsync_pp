<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">My Attendance</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ currentMonth }}</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Present Days</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ presentCount }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Absent Days</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ absentCount }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">On Leave</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ leaveCount }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Attendance Rate</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ attendanceRate }}%</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex items-center gap-3 mb-4">
      <select v-model="statusFilter" class="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All status</option>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="leave">On Leave</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Date</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Check In</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Check Out</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Hours</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.date" class="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.dateLabel }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.checkIn || '—' }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.checkOut || '—' }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.hours || '—' }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', statusClasses[record.status]]">
                {{ record.status }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredRecords.length === 0">
            <td colspan="5" class="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">No records found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data.js'
import { useAuthStore } from '../../stores/auth.js'

const dataStore = useDataStore()
const authStore = useAuthStore()
const statusFilter = ref('')

const currentMonth = computed(() =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

// Approved leave date ranges for the logged-in employee
const myLeaveRanges = computed(() =>
  dataStore.leaves.filter(
    l => l.employeeId === authStore.user?.id && l.status === 'approved'
  )
)

function isOnLeave(dateStr) {
  return myLeaveRanges.value.some(l => l.startDate <= dateStr && l.endDate >= dateStr)
}

// Build day-by-day records for the current month up to today (weekdays only)
const records = computed(() => {
  const emp = authStore.user
  if (!emp) return []

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const seedBase = emp.id.charCodeAt(emp.id.length - 1)

  const result = []
  for (let day = 1; day <= today; day++) {
    const d = new Date(year, month, day)
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue // skip weekends

    const dateStr = d.toISOString().split('T')[0]
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    if (isOnLeave(dateStr)) {
      result.push({ date: dateStr, dateLabel, checkIn: null, checkOut: null, hours: null, status: 'leave' })
      continue
    }

    // Simulate attendance — in a real app this comes from a database
    const seed = seedBase + day
    const isPresent = seed % 5 !== 0 // ~80% present

    if (!isPresent) {
      result.push({ date: dateStr, dateLabel, checkIn: null, checkOut: null, hours: null, status: 'absent' })
      continue
    }

    const checkInHour = 8 + (seed % 2)
    const checkInMin = (seed * 3) % 60
    const checkOutHour = 17 + (seed % 2)
    const checkOutMin = (seed * 7) % 60
    const hours = (checkOutHour + checkOutMin / 60) - (checkInHour + checkInMin / 60)

    result.push({
      date: dateStr,
      dateLabel,
      checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
      checkOut: `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')}`,
      hours: hours.toFixed(1) + 'h',
      status: 'present'
    })
  }

  return result.reverse() // most recent first
})

const filteredRecords = computed(() =>
  statusFilter.value ? records.value.filter(r => r.status === statusFilter.value) : records.value
)

const presentCount = computed(() => records.value.filter(r => r.status === 'present').length)
const absentCount = computed(() => records.value.filter(r => r.status === 'absent').length)
const leaveCount = computed(() => records.value.filter(r => r.status === 'leave').length)
const attendanceRate = computed(() => {
  if (records.value.length === 0) return 0
  return Math.round((presentCount.value / records.value.length) * 100)
})

const statusClasses = {
  present: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  absent: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  leave: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}
</script>