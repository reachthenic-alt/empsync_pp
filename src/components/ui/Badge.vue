<template>
  <span :class="['text-xs px-2 py-1 rounded-md font-medium', classes[variant] || classes.default]">
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  text: String,
  variant: {
    type: String,
    default: 'default'
  }
})

const classes = {
  approved:  'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending:   'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  rejected:  'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  active:    'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  inactive:  'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
  present:   'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  absent:    'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  leave:     'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  paid:      'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  important: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  default:   'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
}
</script>