<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">My Profile</h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">View and update your personal information</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Profile summary card -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xl mb-3">
          {{ getInitials(employee.name) }}
        </div>
        <p class="font-medium text-zinc-900 dark:text-white">{{ employee.name }}</p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ employee.position }}</p>
        <span :class="['mt-3 text-xs px-2 py-1 rounded-md font-medium', employee.status === 'active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400']">
          {{ employee.status }}
        </span>

        <div class="w-full mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500 dark:text-zinc-400">Employee ID</span>
            <span class="text-zinc-900 dark:text-white font-medium">{{ employee.id }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500 dark:text-zinc-400">Department</span>
            <span class="text-zinc-900 dark:text-white font-medium">{{ employee.department }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500 dark:text-zinc-400">Joined</span>
            <span class="text-zinc-900 dark:text-white font-medium">{{ formatDate(employee.joinDate) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500 dark:text-zinc-400">Role</span>
            <span class="text-zinc-900 dark:text-white font-medium capitalize">{{ employee.role }}</span>
          </div>
        </div>
      </div>

      <!-- Editable details -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Contact Information</h2>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
              <input v-model="form.name" type="text" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
              <input v-model="form.phone" type="text" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
              <input :value="employee.email" type="email" disabled class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-500 cursor-not-allowed" />
              <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Contact HR to change your email address</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-5">
            <button @click="saveDetails" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
              Save Changes
            </button>
            <span v-if="savedMessage" class="text-xs text-green-600 dark:text-green-400">{{ savedMessage }}</span>
          </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Change Password</h2>
          <div class="space-y-3 max-w-sm">
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Current Password</label>
              <input v-model="passwordForm.current" type="password" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">New Password</label>
              <input v-model="passwordForm.next" type="password" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
              <input v-model="passwordForm.confirm" type="password" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <p v-if="passwordError" class="text-xs text-red-500 mt-2">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="text-xs text-green-600 dark:text-green-400 mt-2">{{ passwordSuccess }}</p>
          <button @click="changePassword" class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            Update Password
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

// Always read the latest employee record from the store (source of truth)
const employee = computed(() =>
  dataStore.getEmployeeById(authStore.user.id) ?? authStore.user
)

const form = ref({
  name: employee.value.name,
  phone: employee.value.phone,
})

const savedMessage = ref('')

function saveDetails() {
  if (!form.value.name.trim()) return
  dataStore.updateEmployee(employee.value.id, {
    name: form.value.name,
    phone: form.value.phone,
  })
  authStore.updateUser({ name: form.value.name, phone: form.value.phone })
  savedMessage.value = 'Saved!'
  setTimeout(() => (savedMessage.value = ''), 2000)
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const passwordForm = ref({ current: '', next: '', confirm: '' })
const passwordError = ref('')
const passwordSuccess = ref('')

function changePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.value.current !== employee.value.password) {
    passwordError.value = 'Current password is incorrect.'
    return
  }
  if (passwordForm.value.next.length < 6) {
    passwordError.value = 'New password must be at least 6 characters.'
    return
  }
  if (passwordForm.value.next !== passwordForm.value.confirm) {
    passwordError.value = 'New passwords do not match.'
    return
  }

  dataStore.updateEmployee(employee.value.id, { password: passwordForm.value.next })
  authStore.updateUser({ password: passwordForm.value.next })
  passwordSuccess.value = 'Password updated successfully.'
  passwordForm.value = { current: '', next: '', confirm: '' }
}
</script>