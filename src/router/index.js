import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },

    // Main app (protected)
    {
      path: '/',
      component: () => import('../components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('../views/EmployeesView.vue'),
          meta: { roles: ['admin', 'hr'] },
        },
        {
          path: 'leaves',
          name: 'leaves',
          component: () => import('../views/LeavesView.vue'),
          meta: { roles: ['admin', 'hr'] },
        },
        {
          path: 'payroll',
          name: 'payroll',
          component: () => import('../views/PayrollView.vue'),
          meta: { roles: ['admin', 'hr'] },
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: () => import('../views/AnnouncementsView.vue'),
        },
        {
          path: 'attendance',
          name: 'attendance',
          component: () => import('../views/AttendanceView.vue'),
        },
        // Employee self-service
        {
          path: 'my-profile',
          name: 'my-profile',
          component: () => import('../views/employee/MyProfileView.vue'),
        },
        {
          path: 'my-leave',
          name: 'my-leave',
          component: () => import('../views/employee/MyLeaveView.vue'),
        },
        {
          path: 'my-payslip',
          name: 'my-payslip',
          component: () => import('../views/employee/MyPayslipView.vue'),
        },
        {
          path: 'my-attendance',
          name: 'my-attendance',
          component: () => import('../views/employee/MyAttendanceView.vue'),
        },
      ],
    },

    // Catch all - redirect to login
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('empuser') || 'null')
  const requiresAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles

  if (requiresAuth && !user) {
    next({ name: 'login' })
    return
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router