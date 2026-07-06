<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">My Payslips</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ myPayroll.length }} payslip{{ myPayroll.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Latest Net Pay</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">${{ (latestPayslip?.netPay ?? 0).toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Year-to-date Earnings</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white">${{ ytdEarnings.toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Latest Status</p>
        <p class="text-2xl font-semibold text-zinc-900 dark:text-white capitalize">{{ latestPayslip?.status ?? '—' }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Month</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Base Salary</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Bonus</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Deductions</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Net Pay</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Status</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in myPayroll" :key="record.id" class="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <td class="px-4 py-3 font-medium text-zinc-900 dark:text-white">{{ formatMonth(record.month) }}</td>
            <td class="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">${{ record.baseSalary.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right text-green-600 dark:text-green-400">+${{ record.bonus.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right text-red-500 dark:text-red-400">-${{ record.deductions.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right font-medium text-zinc-900 dark:text-white">${{ record.netPay.toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', record.status === 'paid' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400']">
                {{ record.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="viewPayslip(record)" class="text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-medium transition-colors">
                View
              </button>
            </td>
          </tr>
          <tr v-if="myPayroll.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">No payslips found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payslip Detail Modal -->
    <div v-if="selected" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click.self="selected = null">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Payslip — {{ formatMonth(selected.month) }}</h2>
          <span :class="['text-xs px-2 py-1 rounded-md font-medium', selected.status === 'paid' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400']">
            {{ selected.status }}
          </span>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-zinc-500 dark:text-zinc-400">Base Salary</span>
            <span class="text-zinc-900 dark:text-white">${{ selected.baseSalary.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-zinc-500 dark:text-zinc-400">Bonus</span>
            <span class="text-green-600 dark:text-green-400">+${{ selected.bonus.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-zinc-500 dark:text-zinc-400">Deductions</span>
            <span class="text-red-500 dark:text-red-400">-${{ selected.deductions.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between py-2 mt-1 font-semibold">
            <span class="text-zinc-900 dark:text-white">Net Pay</span>
            <span class="text-zinc-900 dark:text-white">${{ selected.netPay.toLocaleString() }}</span>
          </div>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 pt-2">
            {{ selected.status === 'paid' ? `Paid on ${formatDate(selected.payDate)}` : 'Payment pending' }}
          </p>
        </div>
        <button @click="selected = null" class="w-full mt-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          Close
        </button>
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

const myPayroll = computed(() =>
  [...dataStore.payroll]
    .filter(p => p.employeeId === authStore.user?.id)
    .sort((a, b) => b.month.localeCompare(a.month))
)

const latestPayslip = computed(() => myPayroll.value[0] ?? null)

const ytdEarnings = computed(() => {
  const year = new Date().getFullYear().toString()
  return myPayroll.value
    .filter(p => p.month.startsWith(year))
    .reduce((sum, p) => sum + p.netPay, 0)
})

function formatMonth(monthStr) {
  const [year, month] = monthStr.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const selected = ref(null)
function viewPayslip(record) {
  selected.value = record
}
</script>