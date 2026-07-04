import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('emp_theme') === 'dark')

  function toggle() {
    isDark.value = !isDark.value
  }

  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('emp_theme', val ? 'dark' : 'light')
  }, { immediate: true })

  return { isDark, toggle }
})