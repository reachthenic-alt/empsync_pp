<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
    <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{{ label }}</p>
    <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ value }}</p>
    <p v-if="sub" class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{{ sub }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  sub: String,
})
</script>