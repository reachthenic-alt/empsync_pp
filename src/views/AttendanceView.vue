<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">Attendance</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ currentMonth }}</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Employees</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ dataStore.activeEmployees.length }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Present Today</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ presentToday }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Absent Today</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ absentToday }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">On Leave</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ onLeaveToday }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-4">
      <div class="relative flex-1 max-w-xs">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search employee..."
          class="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
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
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Employee</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Department</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Check In</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Check Out</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Hours</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredAttendance" :key="record.employeeId" class="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs flex-shrink-0">
                  {{ getInitials(record.employeeName) }}
                </div>
                <div>
                  <p class="font-medium text-zinc-900 dark:text-white">{{ record.employeeName }}</p>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ record.employeeId }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.department }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.checkIn || '—' }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.checkOut || '—' }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ record.hours || '—' }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', statusClasses[record.status]]">
                {{ record.status }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredAttendance.length === 0">
            <td colspan="6" class="px-4 py-12 text-center text-zinc-400 text-sm">No records found</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/data.js'

const dataStore = useDataStore()
const search = ref('')
const statusFilter = ref('')

const currentMonth = computed(() =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

// Generate attendance records from active employees
const attendanceRecords = computed(() => {
  const todayLeaves = dataStore.leaves
    .filter(l => {
      const today = new Date().toISOString().split('T')[0]
      return l.status === 'approved' && l.startDate <= today && l.endDate >= today
    })
    .map(l => l.employeeId)

  return dataStore.activeEmployees.map(emp => {
    const onLeave = todayLeaves.includes(emp.id)

    if (onLeave) {
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        checkIn: null,
        checkOut: null,
        hours: null,
        status: 'leave'
      }
    }

    // Simulate attendance — in real app this comes from a database
    const seed = emp.id.charCodeAt(emp.id.length - 1)
    const isPresent = seed % 5 !== 0 // ~80% present

    if (!isPresent) {
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        checkIn: null,
        checkOut: null,
        hours: null,
        status: 'absent'
      }
    }

    const checkInHour = 8 + (seed % 2)
    const checkInMin = (seed * 3) % 60
    const checkOutHour = 17 + (seed % 2)
    const checkOutMin = (seed * 7) % 60
    const hours = (checkOutHour + checkOutMin / 60) - (checkInHour + checkInMin / 60)

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
      checkOut: `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')}`,
      hours: hours.toFixed(1) + 'h',
      status: 'present'
    }
  })
})

const filteredAttendance = computed(() =>
  attendanceRecords.value.filter(r => {
    const matchesSearch = r.employeeName.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !statusFilter.value || r.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
)

const presentToday = computed(() => attendanceRecords.value.filter(r => r.status === 'present').length)
const absentToday = computed(() => attendanceRecords.value.filter(r => r.status === 'absent').length)
const onLeaveToday = computed(() => attendanceRecords.value.filter(r => r.status === 'leave').length)

const statusClasses = {
  present: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  absent: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  leave: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>