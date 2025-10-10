<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const API_BASE = 'http://127.0.0.1:1985'

interface UserItem {
  id: string
  login: string
  email: string
  isBlocked: boolean
  createdAt: string
}

const users = ref<UserItem[]>([])
const loading = ref(false)
const showCreate = ref(false)
const showPassword = ref(false)
const editRowId = ref<string | null>(null)
const pwUserId = ref<string | null>(null)
const pw = ref({ password: '', confirm: '' })
const form = ref({ login: '', email: '', password: '' })

// filters
const q = ref('')
const onlyBlocked = ref(false)
const limit = ref(20)
const offset = ref(0)

function authHeaders() {
  return {
    'Authorization': `Bearer ${localStorage.getItem('access_token')||''}`,
    'X-Role': localStorage.getItem('user_role')||'',
    'Content-Type': 'application/json'
  } as Record<string,string>
}

async function loadUsers() {
  loading.value = true
  try {
    const params = new URLSearchParams({ q: q.value, onlyBlocked: String(onlyBlocked.value), limit: String(limit.value), offset: String(offset.value) })
    const resp = await fetch(`${API_BASE}/api/admin/users?` + params.toString(), { headers: authHeaders() })
    const data = await resp.json()
    users.value = data.items || []
  } finally {
    loading.value = false
  }
}

watch([q, onlyBlocked, limit, offset], loadUsers)

async function createUser() {
  if (!form.value.login || !form.value.email || form.value.password.length < 8) return
  await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(form.value)
  })
  showCreate.value = false
  form.value = { login: '', email: '', password: '' }
  offset.value = 0
  await loadUsers()
}

function startEdit(u: UserItem) { editRowId.value = u.id }

async function saveEdit(u: UserItem) {
  await fetch(`${API_BASE}/api/admin/users/${u.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ email: u.email }) })
  editRowId.value = null
  await loadUsers()
}

async function toggleBlock(u: UserItem) {
  await fetch(`${API_BASE}/api/admin/users/${u.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ isBlocked: !u.isBlocked }) })
  await loadUsers()
}

function openPassword(u: UserItem) { pwUserId.value = u.id; pw.value = { password: '', confirm: '' }; showPassword.value = true }

async function savePassword() {
  if (!pwUserId.value || pw.value.password.length < 8 || pw.value.password !== pw.value.confirm) return
  await fetch(`${API_BASE}/api/admin/users/${pwUserId.value}/password`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ newPassword: pw.value.password }) })
  showPassword.value = false
}

async function removeUser(u: UserItem) {
  if (!confirm(`Удалить пользователя ${u.login}?`)) return
  await fetch(`${API_BASE}/api/admin/users/${u.id}`, { method: 'DELETE', headers: authHeaders() })
  await loadUsers()
}

function nextPage() { offset.value += limit.value }
function prevPage() { offset.value = Math.max(0, offset.value - limit.value) }

onMounted(loadUsers)
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold">Админка — Пользователи</h1>
      <button class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-9 px-3 text-sm" @click="showCreate=true">Создать пользователя</button>
    </div>

    <div class="flex items-center gap-3 mb-3">
      <input v-model="q" placeholder="Поиск по логину или email" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-80" />
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="onlyBlocked" /> Только заблокированные</label>
    </div>

    <div v-if="loading">Загрузка...</div>
    <table v-else class="w-full border border-gray-200 text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-2 text-left border-b">Логин</th>
          <th class="p-2 text-left border-b">Email</th>
          <th class="p-2 text-left border-b">Статус</th>
          <th class="p-2 text-left border-b">Создан</th>
          <th class="p-2 text-left border-b w-72">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id" class="bg-white">
          <td class="p-2 border-b">{{ u.login }}</td>
          <td class="p-2 border-b">
            <template v-if="editRowId===u.id">
              <input v-model="u.email" class="border border-gray-300 rounded-md px-2 py-1 text-sm" />
            </template>
            <template v-else>{{ u.email }}</template>
          </td>
          <td class="p-2 border-b">{{ u.isBlocked ? 'Заблокирован' : 'Активен' }}</td>
          <td class="p-2 border-b">{{ u.createdAt }}</td>
          <td class="p-2 border-b">
            <div class="flex gap-2">
              <button v-if="editRowId!==u.id" class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-8 px-2" @click="startEdit(u)">Редактировать</button>
              <button v-else class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-8 px-2" @click="saveEdit(u)">Сохранить</button>
              <button class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-8 px-2" @click="openPassword(u)">Пароль</button>
              <button class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-8 px-2" @click="toggleBlock(u)">{{ u.isBlocked ? 'Разблокировать' : 'Блокировать' }}</button>
              <button class="border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-md h-8 px-2" @click="removeUser(u)">Удалить</button>
            </div>
          </td>
        </tr>
        <tr v-if="users.length===0">
          <td colspan="5" class="p-4 text-center text-gray-500">Пользователи не найдены</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end items-center gap-2 mt-3">
      <button class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-8 px-2" @click="prevPage" :disabled="offset===0">Назад</button>
      <button class="border border-gray-200 bg-white hover:bg-gray-50 rounded-md h-8 px-2" @click="nextPage">Вперед</button>
    </div>

    <!-- Create modal -->
    <div v-if="showCreate" class="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div class="rounded-lg shadow-lg w-full max-w-lg" style="background-color:#F8FAFC;">
        <div class="flex items-center justify-between px-6 py-4">
          <h2 class="text-lg font-semibold">Создать пользователя</h2>
          <button class="text-gray-500" @click="showCreate=false">✕</button>
        </div>
        <div class="px-6 pb-6 space-y-4">
          <div class="bg-white border border-gray-200 rounded-md p-3">
            <label class="block text-sm font-medium mb-1">Логин</label>
            <input v-model="form.login" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="bg-white border border-gray-200 rounded-md p-3">
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="bg-white border border-gray-200 rounded-md p-3">
            <label class="block text-sm font-medium mb-1">Пароль (минимум 8)</label>
            <input type="password" v-model="form.password" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button class="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" @click="showCreate=false">Отмена</button>
            <button class="px-3 py-2 rounded-md text-white" style="background-color:#1E293B" @click="createUser">Сохранить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Password modal -->
    <div v-if="showPassword" class="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div class="rounded-lg shadow-lg w-full max-w-lg" style="background-color:#F8FAFC;">
        <div class="flex items-center justify-between px-6 py-4">
          <h2 class="text-lg font-semibold">Смена пароля</h2>
          <button class="text-gray-500" @click="showPassword=false">✕</button>
        </div>
        <div class="px-6 pb-6 space-y-4">
          <div class="bg-white border border-gray-200 rounded-md p-3">
            <label class="block text-sm font-medium mb-1">Новый пароль</label>
            <input type="password" v-model="pw.password" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="bg-white border border-gray-200 rounded-md p-3">
            <label class="block text-sm font-medium mb-1">Подтверждение</label>
            <input type="password" v-model="pw.confirm" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button class="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" @click="showPassword=false">Отмена</button>
            <button class="px-3 py-2 rounded-md text-white" style="background-color:#1E293B" :disabled="pw.password.length<8 || pw.password!==pw.confirm" @click="savePassword">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

