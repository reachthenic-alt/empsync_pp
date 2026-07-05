<template>
  <button
    :disabled="disabled || loading"
    :class="['flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 disabled:opacity-60', sizeClasses, variantClasses]"
    @click="$emit('click')"
  >
    <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size:    { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled:{ type: Boolean, default: false },
})

defineEmits(['click'])

const variantClasses = computed(() => ({
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  danger:  'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800',
  ghost:   'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800',
}[props.variant]))

const sizeClasses = computed(() => ({
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}[props.size]))
</script>