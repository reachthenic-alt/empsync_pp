<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <th
            v-for="col in columns"
            :key="col.key"
            :class="['px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-xs', col.align === 'right' ? 'text-right' : 'text-left']"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <slot />
        <tr v-if="empty">
          <td :colspan="columns.length" class="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: Array,
  empty: Boolean,
  emptyText: { type: String, default: 'No records found' }
})
</script>