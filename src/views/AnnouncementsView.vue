<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">Announcements</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ dataStore.announcements.length }} announcement{{ dataStore.announcements.length !== 1 ? 's' : '' }}</p>
      </div>
      <button
        v-if="authStore.isAdminOrHR"
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Announcement
      </button>
    </div>

    <!-- Announcements list -->
    <div class="space-y-3">
      <div
        v-for="item in sortedAnnouncements"
        :key="item.id"
        class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ item.title }}</p>
              <span
                v-if="item.priority === 'high'"
                class="text-xs px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium"
              >
                Important
              </span>
            </div>
            <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{{ item.content }}</p>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-xs flex-shrink-0">
                {{ getInitials(item.author) }}
              </div>
              <p class="text-xs text-zinc-400 dark:text-zinc-500">{{ item.author }} · {{ formatDate(item.date) }}</p>
            </div>
          </div>
          <button
            v-if="authStore.isAdminOrHR"
            @click="confirmDelete(item)"
            class="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="dataStore.announcements.length === 0" class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center">
        <p class="text-zinc-400 dark:text-zinc-500 text-sm">No announcements yet</p>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click.self="closeModal">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">New Announcement</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Announcement title"
              class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Content</label>
            <textarea
              v-model="form.content"
              rows="4"
              placeholder="Write your announcement here..."
              class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Priority</label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="normal">Normal</option>
              <option value="high">Important</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeModal" class="flex-1 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button @click="saveAnnouncement" class="flex-1 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            Post
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deletingItem" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click.self="deletingItem = null">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-sm p-6">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Delete announcement?</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">This cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="deletingItem = null" class="flex-1 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
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
import { useAuthStore } from '../stores/auth.js'

const dataStore = useDataStore()
const authStore = useAuthStore()

const showModal = ref(false)
const deletingItem = ref(null)

const sortedAnnouncements = computed(() =>
  [...dataStore.announcements].sort((a, b) => new Date(b.date) - new Date(a.date))
)

const emptyForm = () => ({ title: '', content: '', priority: 'normal' })
const form = ref(emptyForm())

function openAddModal() {
  form.value = emptyForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveAnnouncement() {
  if (!form.value.title || !form.value.content) return
  const newId = 'AN' + String(dataStore.announcements.length + 1).padStart(3, '0')
  dataStore.announcements.push({
    id: newId,
    title: form.value.title,
    content: form.value.content,
    priority: form.value.priority,
    author: authStore.user?.name,
    date: new Date().toISOString().split('T')[0],
  })
  localStorage.setItem('emp_announcements', JSON.stringify(dataStore.announcements))
  closeModal()
}

function confirmDelete(item) {
  deletingItem.value = item
}

function doDelete() {
  const index = dataStore.announcements.findIndex(a => a.id === deletingItem.value.id)
  if (index !== -1) {
    dataStore.announcements.splice(index, 1)
    localStorage.setItem('emp_announcements', JSON.stringify(dataStore.announcements))
  }
  deletingItem.value = null
}

function getInitials(name) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>