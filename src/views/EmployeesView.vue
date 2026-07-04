<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">Employees</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ filteredEmployees.length }} employee{{ filteredEmployees.length !== 1 ? 's' : '' }}</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Employee
      </button>
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
          placeholder="Search employees..."
          class="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <select v-model="deptFilter" class="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All departments</option>
        <option v-for="dept in dataStore.departmentList" :key="dept" :value="dept">{{ dept }}</option>
      </select>
      <select v-model="statusFilter" class="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Employee</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Position</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Department</th>
            <th class="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Status</th>
            <th class="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in filteredEmployees" :key="emp.id" class="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs flex-shrink-0">
                  {{ getInitials(emp.name) }}
                </div>
                <div>
                  <p class="font-medium text-zinc-900 dark:text-white">{{ emp.name }}</p>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ emp.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ emp.position }}</td>
            <td class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ emp.department }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs px-2 py-1 rounded-md font-medium', emp.status === 'active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400']">
                {{ emp.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="openEditModal(emp)" class="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button @click="confirmDelete(emp)" class="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="5" class="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">No employees found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click.self="closeModal">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{{ editingEmployee ? 'Edit Employee' : 'Add Employee' }}</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
            <input v-model="form.name" type="text" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Position</label>
            <input v-model="form.position" type="text" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Department</label>
              <input v-model="form.department" type="text" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role</label>
              <select v-model="form.role" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Salary</label>
              <input v-model.number="form.salary" type="number" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
              <select v-model="form.status" class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeModal" class="flex-1 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button @click="saveEmployee" class="flex-1 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            {{ editingEmployee ? 'Save Changes' : 'Add Employee' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deletingEmployee" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click.self="deletingEmployee = null">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-sm p-6">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Delete employee?</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Are you sure you want to delete <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ deletingEmployee.name }}</span>? This cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="deletingEmployee = null" class="flex-1 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button @click="doDelete" class="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/data.js'

const dataStore = useDataStore()

const search = ref('')
const deptFilter = ref('')
const statusFilter = ref('')

const filteredEmployees = computed(() => {
  return dataStore.employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesDept = !deptFilter.value || emp.department === deptFilter.value
    const matchesStatus = !statusFilter.value || emp.status === statusFilter.value
    return matchesSearch && matchesDept && matchesStatus
  })
})

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const showModal = ref(false)
const editingEmployee = ref(null)
const deletingEmployee = ref(null)

const emptyForm = () => ({
  name: '', email: '', position: '', department: '',
  role: 'employee', salary: 0, status: 'active'
})
const form = ref(emptyForm())

function openAddModal() {
  editingEmployee.value = null
  form.value = emptyForm()
  showModal.value = true
}

function openEditModal(emp) {
  editingEmployee.value = emp
  form.value = { ...emp }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingEmployee.value = null
}

function saveEmployee() {
  if (!form.value.name || !form.value.email) return
  if (editingEmployee.value) {
    dataStore.updateEmployee(editingEmployee.value.id, form.value)
  } else {
    const newId = 'EMP' + String(dataStore.employees.length + 1).padStart(3, '0')
    dataStore.addEmployee({
      ...form.value,
      id: newId,
      password: 'emp123',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: null,
    })
  }
  closeModal()
}

function confirmDelete(emp) {
  deletingEmployee.value = emp
}

function doDelete() {
  dataStore.deleteEmployee(deletingEmployee.value.id)
  deletingEmployee.value = null
}
</script>