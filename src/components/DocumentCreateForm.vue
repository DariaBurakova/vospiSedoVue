<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createDocument } from '@/api/documents'
import { useToast } from '@/composables/useToast'
import { useValidation, validationRules } from '@/composables/useValidation'
import { useHotkeys, commonHotkeys } from '@/composables/useHotkeys'

const emit = defineEmits(['close', 'created'])
const { success, error: showError } = useToast()

// Валидация формы
const { data: formData, errors, validate, validateFieldOnBlur, hasErrors, getFieldError, hasFieldError } = useValidation(
  {
    type: 'Документ',
    meta: '',
    executor: '',
    deadline: '',
    approvers: '',
    outgoingType: 'response',
    noteEnabled: false,
    files: [],
    approversList: [],
    noteType: 'only_me',
    notifyParticipants: false,
    noteText: ''
  },
  {
    type: {
      ...validationRules.required('Тип документа обязателен'),
      ...validationRules.minLength(2, 'Минимум 2 символа')
    },
    meta: {
      ...validationRules.required('Содержание обязательно'),
      ...validationRules.minLength(10, 'Минимум 10 символов')
    },
    executor: {
      ...validationRules.required('Исполнитель обязателен')
    },
    deadline: {
      ...validationRules.required('Срок исполнения обязателен')
    }
  }
)

const loading = ref(false)
const showFileDialog = ref(false)
const isDragOver = ref(false)
const showApproversDropdown = ref(false)
const filteredApprovers = ref([])
const showStatusDropdown = ref(false)
const selectedStatus = ref('В работе')

    const taskStatuses = [
      'В работе',
      'На рассмотрении',
      'Выполнено',
      'Отклонено',
      'Приостановлено',
      'Требует доработки'
    ]

const documentTypes = [
  'Документ',
  'Письмо',
  'Приказ',
  'Договор',
  'Служебная записка'
]

    const executors = [
      'Иванов И.И.',
      'Петров П.П.',
      'Сидоров С.С.',
      'Козлова К.К.'
    ]

    const mockApprovers = [
      'Романов Александр',
      'Лаврентьев Дмитрий', 
      'Константин Маенский',
      'Иванов Иван Иванович',
      'Петров Петр Петрович',
      'Сидоров Сидор Сидорович',
      'Козлова Анна Сергеевна',
      'Смирнов Алексей Владимирович',
      'Кузнецов Дмитрий Александрович',
      'Попова Елена Николаевна'
    ]

const actionTypes = [
  { value: 'familiarization', label: 'Для ознакомления', icon: 'eye' },
  { value: 'execution', label: 'Для выполнения', icon: 'gear' },
  { value: 'reply', label: 'Для ответа', icon: 'chat' }
]

    const addApprover = () => {
      if (formData.value.approvers.trim()) {
        formData.value.approversList.push({
          id: Date.now(),
          name: formData.value.approvers,
          action: 'familiarization',
          dueDate: '',
          hasTask: false,
          taskText: ''
        })
        formData.value.approvers = ''
        showApproversDropdown.value = false
      }
    }

    const searchApprovers = (query) => {
      if (query.length < 1) {
        filteredApprovers.value = []
        showApproversDropdown.value = false
        return
      }
      
      filteredApprovers.value = mockApprovers.filter(approver => 
        approver.toLowerCase().includes(query.toLowerCase())
      )
      showApproversDropdown.value = filteredApprovers.value.length > 0
    }

    const selectApprover = (approver) => {
      formData.value.approvers = approver
      showApproversDropdown.value = false
      filteredApprovers.value = []
    }

    const toggleApprover = (approver) => {
      const existingIndex = formData.value.approversList.findIndex(a => a.name === approver)
      if (existingIndex === -1) {
        // Добавляем согласующего
        formData.value.approversList.push({
          id: Date.now(),
          name: approver,
          action: 'familiarization',
          dueDate: '',
          hasTask: false,
          taskText: ''
        })
      } else {
        // Удаляем согласующего
        formData.value.approversList.splice(existingIndex, 1)
      }
    }

    const isApproverSelected = (approver) => {
      return formData.value.approversList.some(a => a.name === approver)
    }

    const selectStatus = (status) => {
      selectedStatus.value = status
      showStatusDropdown.value = false
    }

    const addMockApprover = (name) => {
      formData.value.approversList.push({
        id: Date.now(),
        name: name,
        action: 'familiarization',
        dueDate: '',
        hasTask: false,
        taskText: ''
      })
    }

const removeApprover = (id) => {
  formData.value.approversList = formData.value.approversList.filter(a => a.id !== id)
}

    const addFile = (file) => {
      formData.value.files.push({
        id: Date.now(),
        name: file.name,
        file: file
      })
    }

    const openFileDialog = () => {
      showFileDialog.value = true
    }

    const closeFileDialog = () => {
      showFileDialog.value = false
      isDragOver.value = false
    }

    const handleFileSelect = (e) => {
      Array.from(e.target.files).forEach(file => {
        addFile(file)
      })
      closeFileDialog()
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      isDragOver.value = true
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      isDragOver.value = false
    }

    const handleDrop = (e) => {
      e.preventDefault()
      isDragOver.value = false
      Array.from(e.dataTransfer.files).forEach(file => {
        addFile(file)
      })
      closeFileDialog()
    }

const removeFile = (id) => {
  formData.value.files = formData.value.files.filter(f => f.id !== id)
}

const handleSubmit = async () => {
  // Валидация формы
  if (!validate()) {
    showError('Ошибка валидации', 'Пожалуйста, исправьте ошибки в форме')
    return
  }

  loading.value = true
  
  try {
    // Генерируем заголовок автоматически на основе типа и статуса
    const autoTitle = `${formData.value.type} - ${selectedStatus.value}`
    
    // Создаем объект с дополнительными данными для meta
    const metaData = {
      content: formData.value.meta,
      approvers: formData.value.approversList,
      outgoingType: formData.value.outgoingType,
      noteEnabled: formData.value.noteEnabled,
      noteType: formData.value.noteType,
      notifyParticipants: formData.value.notifyParticipants,
      noteText: formData.value.noteText,
      files: formData.value.files,
      executor: formData.value.executor,
      deadline: formData.value.deadline,
      status: selectedStatus.value
    }
    
    await createDocument({
      type: formData.value.type,
      title: autoTitle,
      meta: JSON.stringify(metaData)
    })
    
    success('Успех', 'Документ успешно создан')
    emit('created')
    emit('close')
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ошибка создания документа'
    showError('Ошибка', errorMessage)
  } finally {
    loading.value = false
  }
}

    const handleCancel = () => {
      emit('close')
    }

    // Закрытие выпадающих списков при клике вне их
    const handleClickOutside = (event) => {
      if (!event.target.closest('.approvers-dropdown')) {
        showApproversDropdown.value = false
      }
      if (!event.target.closest('.status-dropdown')) {
        showStatusDropdown.value = false
      }
    }

    // Горячие клавиши
    const { register } = useHotkeys()
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      
      // Регистрируем горячие клавиши
      register(commonHotkeys.save(() => {
        if (!loading.value) {
          handleSubmit()
        }
      }))
      
      register(commonHotkeys.cancel(() => {
        handleCancel()
      }))
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" style="background-color: #F8FAFC;">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Исполнение</h2>
              <p class="text-sm text-gray-500 mt-1">документ №</p>
            </div>
        <button 
          @click="handleCancel"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 pb-6" style="display: flex; flex-direction: column; gap: 8px;">
        <!-- Error message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>


        <!-- Статус задачи -->
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Статус задачи</label>
            <div class="relative status-dropdown">
              <button 
                type="button" 
                @click="showStatusDropdown = !showStatusDropdown"
                class="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L8 4L10 2M6 6L8 8L10 6M6 10L8 12L10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ selectedStatus }}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <!-- Выпадающий список статусов -->
              <div v-if="showStatusDropdown" class="absolute z-10 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg min-w-full">
                <div 
                  v-for="status in taskStatuses" 
                  :key="status"
                  @click="selectStatus(status)"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
                >
                  {{ status }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Основные поля документа -->
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="grid grid-cols-2 gap-4">
            <!-- Тип документа -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Тип документа *</label>
              <select 
                v-model="formData.type"
                @blur="validateFieldOnBlur('type')"
                :class="[
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  hasFieldError('type') ? 'border-red-500' : 'border-gray-300'
                ]"
              >
                <option v-for="type in documentTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <div v-if="hasFieldError('type')" class="text-red-500 text-xs mt-1">
                {{ getFieldError('type') }}
              </div>
            </div>

            <!-- Исполнитель -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Исполнитель *</label>
              <select 
                v-model="formData.executor"
                @blur="validateFieldOnBlur('executor')"
                :class="[
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  hasFieldError('executor') ? 'border-red-500' : 'border-gray-300'
                ]"
              >
                <option value="">Выберите исполнителя</option>
                <option v-for="executor in executors" :key="executor" :value="executor">
                  {{ executor }}
                </option>
              </select>
              <div v-if="hasFieldError('executor')" class="text-red-500 text-xs mt-1">
                {{ getFieldError('executor') }}
              </div>
            </div>
          </div>

          <!-- Содержание -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Содержание *</label>
            <textarea 
              v-model="formData.meta"
              @blur="validateFieldOnBlur('meta')"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                hasFieldError('meta') ? 'border-red-500' : 'border-gray-300'
              ]"
              rows="3"
              placeholder="Введите содержание документа..."
            ></textarea>
            <div v-if="hasFieldError('meta')" class="text-red-500 text-xs mt-1">
              {{ getFieldError('meta') }}
            </div>
          </div>

          <!-- Срок исполнения -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Срок исполнения *</label>
            <input 
              v-model="formData.deadline"
              @blur="validateFieldOnBlur('deadline')"
              type="date"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                hasFieldError('deadline') ? 'border-red-500' : 'border-gray-300'
              ]"
            />
            <div v-if="hasFieldError('deadline')" class="text-red-500 text-xs mt-1">
              {{ getFieldError('deadline') }}
            </div>
          </div>
        </div>

        <!-- Файлы -->
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-20 flex-shrink-0">Файлы</label>
            <div class="flex items-center gap-2 flex-1">
              <input 
                type="text" 
                readonly
                :value="formData.files.length > 0 ? formData.files.map(f => f.name).join(', ') : ''"
                class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm flex-1"
                placeholder="Файлы не выбраны"
              />
              <button type="button" @click="openFileDialog" class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 2L12 6M8 2V12M2 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Прикрепить
              </button>
            </div>
          </div>
        </div>

        <!-- Согласующие -->
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Согласующие</label>
            <div class="relative approvers-dropdown">
              <input 
                v-model="formData.approvers"
                type="text"
                @input="searchApprovers($event.target.value)"
                @keyup.enter="addApprover"
                @focus="searchApprovers(formData.approvers)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Добавить"
              />
              
              <!-- Выпадающий список -->
              <div v-if="showApproversDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div 
                  v-for="approver in filteredApprovers" 
                  :key="approver"
                  @click="toggleApprover(approver)"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                >
                  <input 
                    type="checkbox" 
                    :checked="isApproverSelected(approver)"
                    class="focus:ring-2 focus:ring-offset-0"
                    style="accent-color: #1E293B;"
                    @click.stop
                  />
                  {{ approver }}
                </div>
              </div>
            </div>
            
            <!-- Выбранные исполнители -->
            <div v-if="formData.approversList.length > 0" class="mt-3">
              <div class="text-sm font-medium text-gray-700 mb-2">Выбранные исполнители:</div>
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="approver in formData.approversList" 
                  :key="approver.id" 
                  class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{{ approver.name }}</span>
                  <button 
                    type="button" 
                    @click="removeApprover(approver.id)" 
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Список согласующих -->
            <div v-if="formData.approversList.length > 0" class="space-y-3 mt-4">
              <div v-for="approver in formData.approversList" :key="approver.id" class="border border-gray-200 rounded-lg p-3 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">{{ approver.name }}</span>
                  <button type="button" @click="removeApprover(approver.id)" class="text-red-500 hover:text-red-700">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Действие</label>
                    <select v-model="approver.action" class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option v-for="action in actionTypes" :key="action.value" :value="action.value">
                        {{ action.label }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Срок</label>
                    <input 
                      v-model="approver.dueDate"
                      type="date"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <label class="flex items-center gap-2 text-sm">
                    <input 
                      v-model="approver.hasTask"
                      type="checkbox"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Задание</span>
                  </label>
                </div>
                
                <div v-if="approver.hasTask" class="mt-2">
                  <textarea 
                    v-model="approver.taskText"
                    placeholder="Текст задания"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Исходящее -->
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700">Исходящее</label>
              <label class="flex items-center gap-2">
                <input 
                  v-model="formData.outgoingType" 
                  type="radio" 
                  value="response"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">В ответ</span>
              </label>
              <label class="flex items-center gap-2">
                <input 
                  v-model="formData.outgoingType" 
                  type="radio" 
                  value="execution"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">В исполнении на</span>
              </label>
            </div>
            <button type="button" class="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
              Создать исходящее
            </button>
          </div>
        </div>

        <!-- Заметка -->
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Заметка</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="formData.noteEnabled"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E293B]"></div>
            </label>
          </div>
          
          <!-- Поле для ввода заметки -->
          <div v-if="formData.noteEnabled" class="mt-3">
            <textarea 
              v-model="formData.noteText"
              placeholder="Введите текст заметки..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Main Action Button -->
        <div class="pt-4 flex justify-end">
          <button 
            type="submit"
            :disabled="loading"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: #1E293B; color: white; height: 44px; padding: 0 12px; border-radius: 6px;"
          >
            {{ loading ? 'Отправка...' : 'Отправить на исполнение' }}
          </button>
        </div>
      </form>
    </div>

    <!-- File Upload Dialog -->
    <div v-if="showFileDialog" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Прикрепить файлы</h3>
          <button @click="closeFileDialog" class="text-gray-400 hover:text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <!-- Drag & Drop Area -->
        <div 
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          :class="[
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          ]"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 text-gray-400">
            <path d="M4 6L8 2L12 6M8 2V12M2 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="text-gray-600 mb-2">Перетащите файлы сюда</p>
          <p class="text-sm text-gray-500 mb-4">или</p>
          
          <input 
            type="file" 
            multiple 
            @change="handleFileSelect"
            class="hidden"
            id="file-input"
          />
          <label 
            for="file-input"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 2L12 6M8 2V12M2 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Выбрать файлы
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
