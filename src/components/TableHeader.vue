
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { format } from 'date-fns'
import {useTableHeaderStore} from "@/stores/TableHeaderStore.ts"
const tableHeader=useTableHeaderStore()
import VueDatePicker from "@vuepic/vue-datepicker";
import { useTablePreferences } from '@/composables/useTablePreferences'
import type { ColumnId } from '@/composables/useTablePreferences'

// Поиск по столбцам
const searchValues = ref({
  senderNumber: '',      // Исх.номер отправителя
  date: '',              // Дата
  history: '',           // История
  organization: '',      // Организация (отправитель)
  signer: '',            // Подписал
  position: '',          // Должность
  content: '',           // Содержание
  delivery: '',          // Доставка
  executeUntil: '',      // Исполнить до
  incomingNumber: '',    // Вх. №
  incomingDate: '',      // Дата вх.
  execution: '',         // Исполнение
  notes: '',             // Заметки
  files: ''              // Файлы
})

const { visibleColumns, widths, setWidth, save, load, order, setOrder } = useTablePreferences()

onMounted(() => {
  load()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  if (saveTimer) window.clearTimeout(saveTimer)
})

const emit = defineEmits(['search','open-preferences'])

const handleSearch = (column: string, value: string) => {
  (searchValues.value as any)[column] = value
  emit('search', { column, value })
}

// Ресайз: локальное состояние и обработчики
const isResizing = ref(false)
const resizingCol = ref<ColumnId | null>(null)
const startX = ref(0)
const startWidth = ref(0)
let saveTimer: number | undefined

const onMouseMove = (e: MouseEvent) => {
  if (!isResizing.value || !resizingCol.value) return
  const dx = e.clientX - startX.value
  const newWidth = Math.max(0, startWidth.value + dx)
  setWidth(resizingCol.value, newWidth)
  if (saveTimer) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => { save() }, 600)
}

const onMouseUp = () => {
  if (!isResizing.value) return
  isResizing.value = false
  resizingCol.value = null
}

const beginResize = (colId: ColumnId, e: MouseEvent) => {
  if (colId === 'chat') return
  isResizing.value = true
  resizingCol.value = colId
  startX.value = e.clientX
  const target = (e.currentTarget as HTMLElement)
  const th = target?.parentElement as HTMLElement | null
  startWidth.value = (widths as any).value?.[colId] || th?.clientWidth || 120
}

// DnD: перестановка заголовков
const dragSrc = ref<ColumnId | null>(null)
const dragOver = ref<ColumnId | null>(null)

const onDragStart = (id: ColumnId, e: DragEvent) => {
  if (id === 'chat') return
  dragSrc.value = id
  try {
    e.dataTransfer?.setData('text/plain', id)
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  } catch {}
}
const onDragOver = (id: ColumnId, e: DragEvent) => {
  e.preventDefault()
  if (id === 'chat') return
  dragOver.value = id
  try { if (e.dataTransfer) e.dataTransfer.dropEffect = 'move' } catch {}
}
const onDragEnd = () => {
  dragSrc.value = null
  dragOver.value = null
}
const onDrop = (id: ColumnId, e: DragEvent) => {
  try { e.preventDefault(); e.stopPropagation(); } catch {}
  if (!dragSrc.value || id === 'chat') { onDragEnd(); return }
  if (dragSrc.value === id) { onDragEnd(); return }
  const current = [...order.value]
  // гарантируем, что chat первый
  const filtered = current.filter(c => c !== dragSrc.value)
  const targetIdx = filtered.indexOf(id)
  filtered.splice(Math.max(1, targetIdx), 0, dragSrc.value)
  // нормализуем: chat всегда первый
  const withoutChat = filtered.filter(c => c !== 'chat')
  const next = ['chat', ...withoutChat] as ColumnId[]
  setOrder(next)
  save()
  onDragEnd()
}

const isDrop = (id: ColumnId) => dragOver.value === id

</script>

<template>
<tr style="background-color: #fff9f0;" >
  <template v-for="id in order" :key="id">
    <template v-if="visibleColumns.has(id)">
      <!-- Чат: фиксированный, не перетаскивается -->
      <th v-if="id==='chat'" class="headerTh" style="width:28px; min-width:28px; max-width:28px; padding: 0; text-align:center;">
        <div class="divIn" style="justify-content:center;">
          <span class="titleHeader" style="padding-left:0; padding-right:0;">Чат</span>
        </div>
      </th>

      <!-- Исх.номер отправителя -->
      <th v-else-if="id==='senderNumber'" class="headerTh th-resizable"
          draggable="true"
          @dragstart="onDragStart('senderNumber', $event)"
          @dragover="onDragOver('senderNumber', $event)"
          @drop="onDrop('senderNumber', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('senderNumber')"
          :aria-dropeffect="isDrop('senderNumber') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Исх.номер отправителя</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.senderNumber"
                  @input="handleSearch('senderNumber', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по номеру..."
            />
            </div>
        </div>
        <span class="resize-handle" @mousedown.prevent.stop="beginResize('senderNumber', $event)" aria-label="Изменить ширину колонки Исх.номер"></span>
      </th>

      <!-- Дата -->
      <th v-else-if="id==='date'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('date', $event)"
          @dragover="onDragOver('date', $event)"
          @drop="onDrop('date', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('date')"
          :aria-dropeffect="isDrop('date') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Дата</span>
          <div class="flex items-center gap-2 px-2">
            <button  @click="tableHeader.changeShowCalendar(tableHeader.selectDateNow)"  class="buttonDate">
              <span class="text-sm text-[#64748B]" v-if="tableHeader.selectDateNow.date == null">дд.мм.гггг</span>
              <span class="text-sm text-[#64748B]" v-else>{{format(tableHeader.selectDateNow.date, 'dd.MM.yyyy')}}</span>
              <svg class="min-h-[22px] min-w-[18px]" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3333 1.66602V4.99935M5.66667 1.66602V4.99935M1.5 8.33268H16.5M5.66667 11.666H5.675M9 11.666H9.00833M12.3333 11.666H12.3417M5.66667 14.9993H5.675M9 14.9993H9.00833M12.3333 14.9993H12.3417M3.16667 3.33268H14.8333C15.7538 3.33268 16.5 4.07887 16.5 4.99935V16.666C16.5 17.5865 15.7538 18.3327 14.8333 18.3327H3.16667C2.24619 18.3327 1.5 17.5865 1.5 16.666V4.99935C1.5 4.07887 2.24619 3.33268 3.16667 3.33268Z"
                         stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <div class="calendarDiv " v-show="tableHeader.selectDateNow.show" >
                <div class="p-3" style="position: relative;border:none;display: flex;justify-content: center;align-items: center;" >
                  <VueDatePicker v-model="tableHeader.selectDateNow.date" locale="ru" :auto-apply="true" :inline="{ input: false }" teleport />
                </div>
              </div>
            </button>
          </div>
        </div>
      </th>

      <!-- Остальные колонки оставлены как раньше с обёрткой DnD -->
      <!-- История -->
      <th v-else-if="id==='history'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('history', $event)"
          @dragover="onDragOver('history', $event)"
          @drop="onDrop('history', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('history')"
          :aria-dropeffect="isDrop('history') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">История</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.history"
                  @input="handleSearch('history', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по истории..."
            />
            <button  @click="tableHeader.changeShowCalendar(tableHeader.selectDateHistory)"  class="buttonDate">
              <span class="text-sm text-[#64748B]" v-if="tableHeader.selectDateHistory.date == null">дд.мм.гггг</span>
              <span class="text-sm text-[#64748B]" v-else>{{format(tableHeader.selectDateHistory.date, 'dd.MM.yyyy')}}</span>
              <svg class="min-h-[22px] min-w-[18px]" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3333 1.66602V4.99935M5.66667 1.66602V4.99935M1.5 8.33268H16.5M5.66667 11.666H5.675M9 11.666H9.00833M12.3333 11.666H12.3417M5.66667 14.9993H5.675M9 14.9993H9.00833M12.3333 14.9993H12.3417M3.16667 3.33268H14.8333C15.7538 3.33268 16.5 4.07887 16.5 4.99935V16.666C16.5 17.5865 15.7538 18.3327 14.8333 18.3327H3.16667C2.24619 18.3327 1.5 17.5865 1.5 16.666V4.99935C1.5 4.07887 2.24619 3.33268 3.16667 3.33268Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <div class="calendarDiv " v-show="tableHeader.selectDateHistory.show" >
                <div class="p-3" style="position: relative;border:none;display: flex;justify-content: center;align-items: center;" >
                  <VueDatePicker v-model="tableHeader.selectDateHistory.date" locale="ru" :auto-apply="true" :inline="{ input: false }" teleport />
                </div>
              </div>
            </button>
          </div>
        </div>
      </th>

      <!-- Организация (отправитель) -->
      <th v-else-if="id==='organization'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('organization', $event)"
          @dragover="onDragOver('organization', $event)"
          @drop="onDrop('organization', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('organization')"
          :aria-dropeffect="isDrop('organization') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Организация (отправитель)</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.organization"
                  @input="handleSearch('organization', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по организации..."
            />
          </div>
        </div>
      </th>

      <!-- Подписал -->
      <th v-else-if="id==='signer'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('signer', $event)"
          @dragover="onDragOver('signer', $event)"
          @drop="onDrop('signer', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('signer')"
          :aria-dropeffect="isDrop('signer') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Подписал</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.signer"
                  @input="handleSearch('signer', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по подписанту..."
            />
          </div>
        </div>
      </th>

      <!-- Должность -->
      <th v-else-if="id==='position'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('position', $event)"
          @dragover="onDragOver('position', $event)"
          @drop="onDrop('position', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('position')"
          :aria-dropeffect="isDrop('position') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Должность</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.position"
                  @input="handleSearch('position', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по должности..."
            />
          </div>
        </div>
      </th>

      <!-- Содержание -->
      <th v-else-if="id==='content'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('content', $event)"
          @dragover="onDragOver('content', $event)"
          @drop="onDrop('content', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('content')"
          :aria-dropeffect="isDrop('content') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Содержание</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.content"
                  @input="handleSearch('content', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по содержанию..."
            />
          </div>
        </div>
      </th>

      <!-- Доставка -->
      <th v-else-if="id==='delivery'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('delivery', $event)"
          @dragover="onDragOver('delivery', $event)"
          @drop="onDrop('delivery', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('delivery')"
          :aria-dropeffect="isDrop('delivery') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Доставка</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.delivery"
                  @input="handleSearch('delivery', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по доставке..."
            />
          </div>
        </div>
      </th>

      <!-- Исполнить до -->
      <th v-else-if="id==='executeUntil'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('executeUntil', $event)"
          @dragover="onDragOver('executeUntil', $event)"
          @drop="onDrop('executeUntil', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('executeUntil')"
          :aria-dropeffect="isDrop('executeUntil') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Исполнить до</span>
          <div class="flex items-center gap-2 px-2">
            <button  @click="tableHeader.changeShowCalendar(tableHeader.selectDateBefore)"  class="buttonDate">
              <span class="text-sm text-[#64748B]" v-if="tableHeader.selectDateBefore.date == null">дд.мм.гггг</span>
              <span class="text-sm text-[#64748B]" v-else>{{format(tableHeader.selectDateBefore.date, 'dd.MM.yyyy')}}</span>
              <svg class="min-h-[22px] min-w-[18px]" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3333 1.66602V4.99935M5.66667 1.66602V4.99935M1.5 8.33268H16.5M5.66667 11.666H5.675M9 11.666H9.00833M12.3333 11.666H12.3417M5.66667 14.9993H5.675M9 14.9993H9.00833M12.3333 14.9993H12.3417M3.16667 3.33268H14.8333C15.7538 3.33268 16.5 4.07887 16.5 4.99935V16.666C16.5 17.5865 15.7538 18.3327 14.8333 18.3327H3.16667C2.24619 18.3327 1.5 17.5865 1.5 16.666V4.99935C1.5 4.07887 2.24619 3.33268 3.16667 3.33268Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <div class="calendarDiv " v-show="tableHeader.selectDateBefore.show" >
                <div class="p-3" style="position: relative;border:none;display: flex;justify-content: center;align-items: center;" >
                  <VueDatePicker v-model="tableHeader.selectDateBefore.date" locale="ru" :auto-apply="true" :inline="{ input: false }" teleport />
                </div>
              </div>
            </button>
          </div>
        </div>
      </th>

      <!-- Вх. № -->
      <th v-else-if="id==='incomingNumber'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('incomingNumber', $event)"
          @dragover="onDragOver('incomingNumber', $event)"
          @drop="onDrop('incomingNumber', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('incomingNumber')"
          :aria-dropeffect="isDrop('incomingNumber') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Вх. №</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.incomingNumber"
              @input="handleSearch('incomingNumber', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по вх. №..."
            />
          </div>
        </div>
      </th>

      <!-- Дата вх. -->
      <th v-else-if="id==='incomingDate'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('incomingDate', $event)"
          @dragover="onDragOver('incomingDate', $event)"
          @drop="onDrop('incomingDate', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('incomingDate')"
          :aria-dropeffect="isDrop('incomingDate') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Дата вх.</span>
          <div class="flex items-center gap-2 px-2">
            <button  @click="tableHeader.changeShowCalendar(tableHeader.selectDateIn)"  class="buttonDate">
              <span class="text-sm text-[#64748B]" v-if="tableHeader.selectDateIn.date == null">дд.мм.гггг</span>
              <span class="text-sm text-[#64748B]" v-else>{{format(tableHeader.selectDateIn.date, 'dd.MM.yyyy')}}</span>
              <svg class="min-h-[22px] min-w-[18px]" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3333 1.66602V4.99935M5.66667 1.66602V4.99935M1.5 8.33268H16.5M5.66667 11.666H5.675M9 11.666H9.00833M12.3333 11.666H12.3417M5.66667 14.9993H5.675M9 14.9993H9.00833M12.3333 14.9993H12.3417M3.16667 3.33268H14.8333C15.7538 3.33268 16.5 4.07887 16.5 4.99935V16.666C16.5 17.5865 15.7538 18.3327 14.8333 18.3327H3.16667C2.24619 18.3327 1.5 17.5865 1.5 16.666V4.99935C1.5 4.07887 2.24619 3.33268 3.16667 3.33268Z"
                  stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <div class="calendarDiv " v-show="tableHeader.selectDateIn.show" >
                <div class="p-3" style="position: relative;border:none;display: flex;justify-content: center;align-items: center;" >
                  <VueDatePicker v-model="tableHeader.selectDateIn.date" locale="ru" :auto-apply="true" :inline="{ input: false }" teleport />
                </div>
              </div>
            </button>
          </div>
        </div>
      </th>

      <!-- Исполнение -->
      <th v-else-if="id==='execution'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('execution', $event)"
          @dragover="onDragOver('execution', $event)"
          @drop="onDrop('execution', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('execution')"
          :aria-dropeffect="isDrop('execution') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Исполнение</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.execution"
              @input="handleSearch('execution', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по исполнению..."
            />
          </div>
        </div>
      </th>

      <!-- Заметки -->
      <th v-else-if="id==='notes'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('notes', $event)"
          @dragover="onDragOver('notes', $event)"
          @drop="onDrop('notes', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('notes')"
          :aria-dropeffect="isDrop('notes') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Заметки</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.notes"
              @input="handleSearch('notes', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по заметкам..."
            />
          </div>
        </div>
      </th>

      <!-- Файлы -->
      <th v-else-if="id==='files'" class="headerTh"
          draggable="true"
          @dragstart="onDragStart('files', $event)"
          @dragover="onDragOver('files', $event)"
          @drop="onDrop('files', $event)"
          @dragend="onDragEnd"
          :data-drop="isDrop('files')"
          :aria-dropeffect="isDrop('files') ? 'move' : undefined">
        <div class="divIn">
          <span class="titleHeader">Файлы</span>
          <div class="flex items-center gap-2 px-2">
            <svg  class="min-h-[18px] min-w-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <input  
              type="text" 
              v-model="searchValues.files"
              @input="handleSearch('files', ($event.target as HTMLInputElement).value)"
              class="rounded-md p-1 text-sm bg-transparent w-full outline-none"
              placeholder="Поиск по файлам..."
            />
          </div>
        </div>
      </th>
    </template>
  </template>
  <th class="">
    <div class="w-11 min-h-[76px] z-40 bg-white flex items-end px-3 py-2 border border-gray-200">
      <button type="button" @click="$emit('open-preferences')" class="p-0 m-0 bg-transparent outline-none hover:opacity-80">
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.33301 7.30667L14.6663 1H1.33301L6.66634 7.30667V11.6667L7.99967 12.3333M9.99967 9L14.6663 13.6667M9.99967 13.6667L14.6663 9" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </th>
</tr>
</template>

<style scoped>
/* Добавьте здесь стили по необходимости */
.headerTh{
  border: 1px solid #e5e7eb; /* border-gray-200 */
  padding: 0.5rem;           /* py-2 */
  text-align: left;          /* text-left */
  /* min-width: 300px;  убрано, чтобы не конфликтовать с colgroup */
  z-index: 30;
  position: relative;
  user-select: none;
}
.drop-target { outline: 2px dashed #94a3b8; }
.th-resizable { padding-right: 10px; }
.headerTh[draggable="true"] { cursor: grab; }
.headerTh[draggable="true"]:active { cursor: grabbing; }
/* Видимый индикатор места вставки */
th[data-drop="true"]::before {
  content: "";
  position: absolute;
  left: -3px;
  top: 0;
  width: 3px;
  height: 100%;
  background: #2563eb; /* blue-600 */
}
.resize-handle{
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
}
.divIn{
  display: flex;             /* flex */
  flex-direction: column;    /* flex-col */
  gap: 0.25rem;              /* gap-1 */
  overflow: hidden;          /* overflow-hidden */
  width: 100%;
}
.titleHeader{
  font-weight: 500;         /* font-medium */
  overflow: hidden;         /* overflow-hidden */
  width: 100%;              /* w-full */
  white-space: nowrap;      /* text-nowrap */
  padding-left: 0.5rem;     /* px-2 */
  padding-right: 0.5rem;
}
.calendarDiv{
  position: absolute;
  top: 50px;
  left: auto;
  right: auto;
  z-index: 100;
  opacity: 1;
}
.buttonDate{
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  white-space: nowrap;
  border-radius: 0.375rem; /* rounded-md */
  font-size: 0.875rem; /* text-sm */
  transition: color 0.2s ease, background-color 0.2s ease;
  outline: none;
  border: 1px solid #e2e8f0; /* border-slate-200 */
  color: var(--text-muted-foreground);
  width: 100%;
  justify-content: space-between;
  text-align: left;
  font-weight: normal;
  padding: 0;
  background-color: transparent;
  border: none;
  box-shadow: none;
  height: 1.5rem; /* h-6 */
}
.buttonDate:hover{
  color: #0f172a; /* hover:text-slate-900 */
  background-color: transparent; /* hover:bg-transparent */
}
.buttonDate:focus-visible{
  outline: none;
  box-shadow: 0 0 0 2px #0f172a; /* focus-visible:ring-1 ring-slate-950 */
}
.buttonDate svg{
  pointer-events: none;
  width: 1rem; /* size-4 */
  height: 1rem;
  flex-shrink: 0; /* shrink-0 */
}
</style>



