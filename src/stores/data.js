import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import employeesData from '../data/employees.json'
import leavesData from '../data/leaves.json'
import payrollData from '../data/payroll.json'
import announcementsData from '../data/announcements.json'

export const useDataStore = defineStore('data', () => {
  const employees = ref(
    JSON.parse(localStorage.getItem('emp_employees')) ||
    employeesData.employees
  )
  const leaves = ref(
    JSON.parse(localStorage.getItem('emp_leaves')) ||
    leavesData.leaves
  )
  const payroll = ref(
    JSON.parse(localStorage.getItem('emp_payroll')) ||
    payrollData.payroll
  )
  const announcements = ref(
    JSON.parse(localStorage.getItem('emp_announcements')) ||
    announcementsData.announcements
  )

  function persist() {
    localStorage.setItem('emp_employees', JSON.stringify(employees.value))
    localStorage.setItem('emp_leaves', JSON.stringify(leaves.value))
    localStorage.setItem('emp_payroll', JSON.stringify(payroll.value))
    localStorage.setItem('emp_announcements', JSON.stringify(announcements.value))
  }

  // ---------- Employees ----------
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
  const departmentStats = computed(() => {
    const counts = {}
    activeEmployees.value.forEach(e => {
      counts[e.department] = (counts[e.department] || 0) + 1
    })
    return Object.entries(counts).map(([department, count]) => ({ department, count }))
  })

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

  // ---------- Leaves ----------
  const pendingLeaves = computed(() =>
    leaves.value.filter(l => l.status === 'pending')
  )
  const recentLeaves = computed(() =>
    [...leaves.value]
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
      .slice(0, 5)
  )

  function updateLeaveStatus(id, status) {
    const leave = leaves.value.find(l => l.id === id)
    if (leave) {
      leave.status = status
      persist()
    }
  }
  function addLeave(leave) {
    leaves.value.push(leave)
    persist()
  }

  // ---------- Payroll ----------
  const totalPayrollThisMonth = computed(() =>
    payroll.value
      .filter(p => p.month === '2026-06')
      .reduce((sum, p) => sum + p.netPay, 0)
  )
  const pendingPayroll = computed(() =>
    payroll.value.filter(p => p.status === 'pending')
  )

  // ---------- Announcements ----------
  const recentAnnouncements = computed(() =>
    [...announcements.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
  )

  return {
    employees, leaves, payroll, announcements,
    activeEmployees, getEmployeeById, getEmployeeByEmail,
    departmentList, departmentStats,
    addEmployee, updateEmployee, deleteEmployee,
    pendingLeaves, recentLeaves, updateLeaveStatus, addLeave,
    totalPayrollThisMonth, pendingPayroll,
    recentAnnouncements,
  }
})