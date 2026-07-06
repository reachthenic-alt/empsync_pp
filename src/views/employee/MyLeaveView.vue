<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">My Leave</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ myLeaves.length }} request{{ myLeaves.length !== 1 ? 's' : '' }}</p>
      </div>
      <button
        @click="openApplyModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Apply for Leave
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Leave Balance</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ leaveBalance }} days</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Approved</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ approvedCount }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Pending</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ pendingCount }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Rejected</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ rejectedCount }}</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex items-center gap-3 mb-4">
      <select v-model="statusFilter" class="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Type</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Dates</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Days</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Reason</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Applied</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="leave in filteredLeaves" :key="leave.id" class="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ leave.type }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{{ formatRange(leave.startDate, leave.endDate) }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ leave.days }}</td>
            <td class="px-4 py-3 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">{{ leave.reason }}</td>
            <td class="px-4 py-3 text-zinc-500 dark:text-zinc-400">{{ formatDate(leave.appliedDate) }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', statusClasses[leave.status]]">
                {{ leave.status }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredLeaves.length === 0">
            <td colspan="6" class="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">No leave requests found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Apply Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click.self="closeModal">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Apply for Leave</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Type</label>
            <select v-model="form.type" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Date</label>
              <input v-model="form.startDate" type="date" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">End Date</label>
              <input v-model="form.endDate" type="date" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Reason</label>
            <textarea v-model="form.reason" rows="3" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <p v-if="formError" class="text-xs text-red-500">{{ formError }}</p>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeModal" class="flex-1 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button @click="submitLeave" class="flex-1 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            Submit
          </button>
        </div>
      </div>
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
const ANNUAL_ALLOWANCE = 18

const myLeaves = computed(() =>
  [...dataStore.leaves]
    .filter(l => l.employeeId === authStore.user?.id)
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
)

const filteredLeaves = computed(() =>
  statusFilter.value ? myLeaves.value.filter(l => l.status === statusFilter.value) : myLeaves.value
)

const approvedCount = computed(() => myLeaves.value.filter(l => l.status === 'approved').length)
const pendingCount = computed(() => myLeaves.value.filter(l => l.status === 'pending').length)
const rejectedCount = computed(() => myLeaves.value.filter(l => l.status === 'rejected').length)

const daysUsed = computed(() =>
  myLeaves.value
    .filter(l => l.status === 'approved' && l.type !== 'Unpaid')
    .reduce((sum, l) => sum + l.days, 0)
)
const leaveBalance = computed(() => Math.max(ANNUAL_ALLOWANCE - daysUsed.value, 0))

const statusClasses = {
  approved: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  rejected: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

function formatRange(start, end) {
  const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return start === end ? s : `${s} – ${e}`
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const showModal = ref(false)
const formError = ref('')
const emptyForm = () => ({ type: 'Annual', startDate: '', endDate: '', reason: '' })
const form = ref(emptyForm())

function openApplyModal() {
  form.value = emptyForm()
  formError.value = ''
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

function submitLeave() {
  const { type, startDate, endDate, reason } = form.value
  if (!startDate || !endDate || !reason) {
    formError.value = 'Please fill in all fields.'
    return
  }
  if (new Date(endDate) < new Date(startDate)) {
    formError.value = 'End date cannot be before start date.'
    return
  }

  const days = Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1

  dataStore.addLeave({
    id: 'LV' + String(dataStore.leaves.length + 1).padStart(3, '0'),
    employeeId: authStore.user.id,
    employeeName: authStore.user.name,
    type,
    startDate,
    endDate,
    days,
    reason,
    status: 'pending',
    appliedDate: new Date().toISOString().split('T')[0],
  })

  closeModal()
}
</script>