<script setup lang="ts">
import { onMounted } from 'vue'
import { useTablePreferences } from '@/composables/useTablePreferences'
import { useToast } from '@/composables/useToast'

const emit = defineEmits(['close','saved'])

const { ALL_COLUMNS, visibleColumns, load, toggle, selectAll, resetToDefault, deselectAll, save } = useTablePreferences()
const { success, error } = useToast()

const LABELS: Record<string, string> = {
  chat: 'Чат',
  senderNumber: 'Исх.номер отправителя',
  date: 'Дата',
  history: 'История',
  organization: 'Организация (отправитель)',
  signer: 'Подписал',
  position: 'Должность',
  content: 'Содержание',
  delivery: 'Доставка',
  executeUntil: 'Исполнить до',
  incomingNumber: 'Вх. №',
  incomingDate: 'Дата вх.',
  execution: 'Исполнение',
  notes: 'Заметки',
  files: 'Файлы'
}

onMounted(() => {
  load()
})

const handleSave = async () => {
  try {
    await save()
    success('Сохранено', 'Настройки колонок сохранены')
    emit('saved')
    emit('close')
  } catch (e) {
    error('Ошибка', 'Не удалось сохранить настройки')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" style="background-color: #F8FAFC;">
      <div class="flex items-center justify-between px-6 py-4">
        <h2 class="text-xl font-semibold text-gray-900">Настройка колонок</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="px-6 pb-6 space-y-4">
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-medium text-gray-700">Колонки таблицы</div>
            <div class="space-x-2">
              <button type="button" @click="selectAll()" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">Выбрать всё</button>
              <button type="button" @click="deselectAll()" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">Сбросить</button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="col in ALL_COLUMNS" :key="col" class="flex items-center gap-2 text-sm">
              <input type="checkbox" :checked="visibleColumns.has(col)" @change="toggle(col)" class="text-slate-900 focus:ring-slate-900" />
              <span>{{ LABELS[col] || col }}</span>
            </label>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button @click="handleSave" class="inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors font-medium" style="background-color: #1E293B; color: white; height: 44px; padding: 0 12px; border-radius: 6px;">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
