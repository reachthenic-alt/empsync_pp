import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import employeesData from '../data/employees.json'

export const useDataStore = defineStore('data', () => {
  const employees = ref(
    JSON.parse(localStorage.getItem('emp_employees')) ||
    employeesData.employees
  )

  // Save to localStorage whenever we update
  function persist() {
    localStorage.setItem('emp_employees', JSON.stringify(employees.value))
  }

  // Getters
  const activeEmployees = computed(() =>
    employees.value.filter(e => e.status === 'active')
  )

  const getEmployeeById = computed(() => (id) =>
    employees.value.find(e => e.id === id)
  )

  const getEmployeeByEmail = computed(() => (email) =>
    employees.value.find(e => e.email === email)
  )

  const departmentList = computed(() => [
    ...new Set(employees.value.map(e => e.department))
  ])

  // Actions
  function addEmployee(employee) {
    employees.value.push(employee)
    persist()
  }

  function updateEmployee(id, updates) {
    const index = employees.value.findIndex(e => e.id === id)
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...updates }
      persist()
    }
  }

  function deleteEmployee(id) {
    employees.value = employees.value.filter(e => e.id !== id)
    persist()
  }

  return {
    employees,
    activeEmployees,
    getEmployeeById,
    getEmployeeByEmail,
    departmentList,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }
})