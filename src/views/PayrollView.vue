<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900">Payroll</h1>
        <p class="text-sm text-zinc-500 mt-0.5">June 2026</p>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white border border-zinc-200 rounded-xl p-4">
        <p class="text-xs text-zinc-500 mb-1">Total payroll</p>
        <p class="text-2xl font-semibold text-zinc-900">${{ totalPayroll.toLocaleString() }}</p>
      </div>
      <div class="bg-white border border-zinc-200 rounded-xl p-4">
        <p class="text-xs text-zinc-500 mb-1">Paid</p>
        <p class="text-2xl font-semibold text-zinc-900">{{ paidCount }}</p>
      </div>
      <div class="bg-white border border-zinc-200 rounded-xl p-4">
        <p class="text-xs text-zinc-500 mb-1">Pending</p>
        <p class="text-2xl font-semibold text-zinc-900">{{ pendingCount }}</p>
      </div>
      <div class="bg-white border border-zinc-200 rounded-xl p-4">
        <p class="text-xs text-zinc-500 mb-1">Avg. net pay</p>
        <p class="text-2xl font-semibold text-zinc-900">${{ avgNetPay.toLocaleString() }}</p>
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
          class="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <select v-model="statusFilter" class="px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All status</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 bg-zinc-50">
            <th class="text-left px-4 py-3 font-medium text-zinc-500 text-xs">Employee</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 text-xs">Base salary</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 text-xs">Bonus</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 text-xs">Deductions</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 text-xs">Net pay</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 text-xs">Status</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredPayroll" :key="record.id" class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs flex-shrink-0">
                  {{ getInitials(record.employeeName) }}
                </div>
                <p class="font-medium text-zinc-900">{{ record.employeeName }}</p>
              </div>
            </td>
            <td class="px-4 py-3 text-right text-zinc-700">${{ record.baseSalary.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right text-green-600">+${{ record.bonus.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right text-red-500">-${{ record.deductions.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right font-medium text-zinc-900">${{ record.netPay.toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', record.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700']">
                {{ record.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                v-if="record.status === 'pending'"
                @click="markAsPaid(record)"
                class="text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors"
              >
                Mark as paid
              </button>
              <span v-else class="text-xs text-zinc-400">{{ formatDate(record.payDate) }}</span>
            </td>
          </tr>
          <tr v-if="filteredPayroll.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-zinc-400 text-sm">No payroll records found</td>
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

const filteredPayroll = computed(() => {
  return dataStore.payroll.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !statusFilter.value || record.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const totalPayroll = computed(() =>
  dataStore.payroll.reduce((sum, r) => sum + r.netPay, 0)
)
const paidCount = computed(() =>
  dataStore.payroll.filter(r => r.status === 'paid').length
)
const pendingCount = computed(() =>
  dataStore.payroll.filter(r => r.status === 'pending').length
)
const avgNetPay = computed(() =>
  dataStore.payroll.length
    ? Math.round(totalPayroll.value / dataStore.payroll.length)
    : 0
)

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function markAsPaid(record) {
  record.status = 'paid'
  record.payDate = new Date().toISOString().split('T')[0]
  localStorage.setItem('emp_payroll', JSON.stringify(dataStore.payroll))
}
</script>