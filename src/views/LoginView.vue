<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-50">
    <div class="w-full max-w-md px-8 py-10 bg-white border border-zinc-200 rounded-2xl">

      <!-- Logo & Title -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-zinc-900">EmpSync</h1>
        <p class="text-sm text-zinc-500 mt-1">Employee Management System</p>
      </div>

      <!-- Error message -->
      <div v-if="errorMsg" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {{ errorMsg }}
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@empsync.com"
            class="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @keyup.enter="handleLogin"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @keyup.enter="handleLogin"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors duration-150"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>

      <!-- Demo credentials -->
      <div class="mt-6 border-t border-zinc-100 pt-5">
        <p class="text-xs text-zinc-400 text-center mb-3">Demo credentials</p>
        <div class="space-y-2">
          <button
            v-for="cred in demoCreds"
            :key="cred.role"
            @click="fillCredentials(cred)"
            class="w-full flex items-center justify-between px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors duration-150"
          >
            <span class="text-xs font-medium text-zinc-700 capitalize">{{ cred.role }}</span>
            <span class="text-xs text-zinc-400">{{ cred.email }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useDataStore } from '../stores/data.js'

const router = useRouter()
const authStore = useAuthStore()
const dataStore = useDataStore()

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const demoCreds = [
  { role: 'admin', email: 'sovannareach@empsync.com', password: 'admin123' },
  { role: 'hr', email: 'kakda@empsync.com', password: 'hr123' },
  { role: 'employee', email: 'panhasak@empsync.com', password: 'emp123' },
]

function fillCredentials(cred) {
  form.value.email = cred.email
  form.value.password = cred.password
  errorMsg.value = ''
}

async function handleLogin() {
  errorMsg.value = ''

  if (!form.value.email || !form.value.password) {
    errorMsg.value = 'Please fill in all fields.'
    return
  }

  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 600))

  const employee = dataStore.getEmployeeByEmail(form.value.email)

  if (!employee || employee.password !== form.value.password) {
    errorMsg.value = 'Invalid email or password.'
    loading.value = false
    return
  }

  if (employee.status === 'inactive') {
    errorMsg.value = 'Your account is inactive. Please contact HR.'
    loading.value = false
    return
  }

  authStore.login(employee)
  router.push({ name: 'dashboard' })
}
</script>