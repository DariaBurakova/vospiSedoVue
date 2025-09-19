<template>
  <div
    v-if="isOpen"
    role="dialog"
    class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[830px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 duration-200 bg-[#F8FAFC] rounded-md shadow-lg p-4 sm:rounded-lg dark:border-slate-800 dark:bg-slate-950"
    tabindex="-1"
    style="pointer-events: auto"
  >
    <!-- Заголовок -->
    <div class="flex flex-col">
      <h2 class="text-lg font-bold mb-0">Исполнение</h2>
      <p class="text-sm text-[#64748B]">документ № {{ documentNum }}</p>
    </div>

    <!-- Статус задачи -->
    <div class="p-4 rounded-sm bg-white flex items-center gap-2">
      <p class="text-sm min-w-32">Статус задачи</p>
      <button
        class="flex gap-1 h-10 items-center justify-between whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white w-[180px]"
        @click="toggleStatus"
      >
        <span>{{ status }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 min-w-4 opacity-50">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
    </div>

    <!-- Файлы -->
    <div class="p-4 rounded-sm bg-white flex items-center gap-2">
      <p class="text-sm min-w-32">Файлы</p>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-slate-200 bg-white shadow-sm hover:bg-slate-100 px-4 py-2 h-10"
        @click="attachFile"
      >
        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.532 8.15999L8.24788 13.4441C6.80966 14.8823 4.65271 15.0521 3.18635 13.5858C1.74813 12.1475 1.93505 10.064 3.40141 8.59761L9.34128 2.65774C10.2504 1.74866 11.7139 1.74866 12.623 2.65774C13.5321 3.56683 13.5321 5.03038 12.623 5.93947L6.57884 11.9836C6.12573 12.4367 5.39109 12.4367 4.93798 11.9836C4.48487 11.5305 4.48486 10.7959 4.93798 10.3428L10.3264 4.95439"
                stroke="#1E293B" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Прикрепить
      </button>
    </div>

    <!-- Согласующие -->
    <div class="p-4 rounded-sm bg-white flex flex-col gap-2">
      <p class="text-sm min-w-32">Согласующие</p>
      <input
        type="button"
        class="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base shadow-sm"
        placeholder="Добавить"
        @click="addApprover"
      />
    </div>

    <!-- Исходящее -->
    <div class="p-4 rounded-sm bg-white flex flex-col gap-2">
      <p class="text-sm min-w-32">Исходящее</p>
      <div class="flex items-center justify-between">
        <div role="radiogroup" class="flex gap-4">
          <div class="flex items-center space-x-2">
            <button type="button"
                    :aria-checked="outgoingOption==='response'"
                    class="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 shadow"
                    @click="setOutgoing('response')"
                    id="option-one">
              <span v-if="outgoingOption==='response'" class="p-[2px] min-w-4 min-h-4 h-4 block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle h-2.5 w-2.5 fill-slate-900">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </span>
            </button>
            <label class="text-sm font-medium leading-none" for="option-one">В ответ</label>
          </div>
          <div class="flex items-center space-x-2">
            <button type="button"
                    :aria-checked="outgoingOption==='execution'"
                    class="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 shadow"
                    @click="setOutgoing('execution')" id="option-two"></button>
            <label class="text-sm font-medium leading-none" for="option-two">В исполнении на</label>
          </div>
        </div>
        <button
          class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 px-4 py-2 h-10"
          @click="createOutgoing"
        >Создать исходящее</button>
      </div>
    </div>

    <!-- Переключатель заметки -->
    <div class="p-4 rounded-sm bg-white flex flex-col gap-2">
      <div class="flex items-center space-x-2">
        <button
          type="button"
          :aria-checked="noteOn"
          class="peer inline-flex h-5 w-9 items-center rounded-full shadow-sm transition-colors"
          @click="toggleNote">
          <span class="block h-4 w-4 rounded-full bg-white shadow-lg" :style="{transform: noteOn ? 'translateX(16px)' : 'translateX(0)'}"></span>
        </button>
        <label class="text-sm font-medium" for="airplane-mode">Заметка</label>
      </div>
    </div>

    <!-- Кнопки действия -->
    <button class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-slate-800 text-slate-50 shadow hover:bg-[#31425A] duration-300 px-4 py-2 h-10 ms-auto" @click="submitExecution">Отправить на исполнение</button>
    <button type="button" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950" @click="closeDialog">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-4 w-4">
        <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
      </svg>
      <span class="sr-only">Close</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Диалог открыт
const isOpen = ref(true)
const documentNum = ref('12345')

// Статус задачи
const status = ref('В работе')
function toggleStatus() {
  status.value = (status.value === 'В работе' ? 'Завершено' : 'В работе')
}

// Файлы
function attachFile() {
  alert('Загрузка файла...')
}

// Согласующие
function addApprover() {
  alert('Добавить согласующего')
}

// Исходящее
const outgoingOption = ref('response')
function setOutgoing(opt) {
  outgoingOption.value = opt
}
function createOutgoing() {
  alert('Исходящее создано')
}

// Переключатель заметки
const noteOn = ref(false)
function toggleNote() {
  noteOn.value = !noteOn.value
}

// Кнопки действия
function submitExecution() {
  alert('Письмо отправлено на исполнение!')
}
function closeDialog() {
  isOpen.value = false
}
</script>
