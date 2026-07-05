<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">Leave Requests</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ filteredLeaves.length }} request{{ filteredLeaves.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <div class="flex items-center gap-3 mb-4">
      <div class="relative flex-1 max-w-xs">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" type="text" placeholder="Search by employee..." class="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <select v-model="statusFilter" class="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <select v-model="typeFilter" class="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All types</option>
        <option value="Annual">Annual</option>
        <option value="Sick">Sick</option>
        <option value="Unpaid">Unpaid</option>
      </select>
    </div>

    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Employee</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Type</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Dates</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Days</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Reason</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Status</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="leave in filteredLeaves" :key="leave.id" class="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs flex-shrink-0">{{ getInitials(leave.employeeName) }}</div>
                <p class="font-medium text-zinc-900 dark:text-white">{{ leave.employeeName }}</p>
              </div>
            </td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ leave.type }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{{ formatRange(leave.startDate, leave.endDate) }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ leave.days }}</td>
            <td class="px-4 py-3 text-zinc-500 dark:text-zinc-400 max-w-[180px] truncate">{{ leave.reason }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', statusClasses[leave.status]]">{{ leave.status }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <div v-if="leave.status === 'pending'" class="flex justify-end gap-2">
                <button @click="updateStatus(leave, 'approved')" class="text-xs px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 font-medium transition-colors">Approve</button>
                <button @click="updateStatus(leave, 'rejected')" class="text-xs px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 font-medium transition-colors">Reject</button>
              </div>
              <span v-else class="text-xs text-zinc-400 dark:text-zinc-500">—</span>
            </td>
          </tr>
          <tr v-if="filteredLeaves.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">No leave requests found</td>
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
const typeFilter = ref('')

const filteredLeaves = computed(() => {
  return [...dataStore.leaves]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .filter(leave => {
      const matchesSearch = leave.employeeName.toLowerCase().includes(search.value.toLowerCase())
      const matchesStatus = !statusFilter.value || leave.status === statusFilter.value
      const matchesType = !typeFilter.value || leave.type === typeFilter.value
      return matchesSearch && matchesStatus && matchesType
    })
})

const statusClasses = {
  approved: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending:  'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  rejected: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatRange(start, end) {
  const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return start === end ? s : `${s} – ${e}`
}

function updateStatus(leave, status) {
  dataStore.updateLeaveStatus(leave.id, status)
}
</script>