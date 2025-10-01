import { ref, computed } from 'vue'
import { listDocuments, createDocument, updateDocument, deleteDocument } from '@/api/documents'
import { useToast } from './useToast'
import { useValidation, validationRules } from './useValidation'

export interface Document {
  id: string
  type: string
  title: string
  meta: string
  created_at: string
  updated_at: string
}

export function useDocuments() {
  const { success, error: showError } = useToast()
  
  const documents = ref<Document[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(50)

  // Фильтрованные документы
  const filteredDocuments = computed(() => {
    if (!searchQuery.value) return documents.value
    
    const query = searchQuery.value.toLowerCase()
    return documents.value.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.type.toLowerCase().includes(query) ||
      doc.meta.toLowerCase().includes(query)
    )
  })

  // Пагинация
  const paginatedDocuments = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredDocuments.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredDocuments.value.length / pageSize.value)
  )

  // Загрузка документов
  const loadDocuments = async () => {
    try {
      loading.value = true
      error.value = null
      const docs = await listDocuments(pageSize.value, (currentPage.value - 1) * pageSize.value)
      documents.value = docs.map(doc => ({
        id: doc.id || '',
        type: doc.type || 'Документ',
        title: doc.title || 'Документ',
        meta: doc.meta || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки документов'
      showError('Ошибка', 'Не удалось загрузить документы')
    } finally {
      loading.value = false
    }
  }

  // Создание документа
  const createNewDocument = async (documentData: Partial<Document>) => {
    try {
      loading.value = true
      const newDoc = await createDocument({
        type: documentData.type || 'Документ',
        title: documentData.title || 'Новый документ',
        meta: documentData.meta || ''
      })
      const doc = {
        id: newDoc.id || '',
        type: newDoc.type || 'Документ',
        title: newDoc.title || 'Документ',
        meta: newDoc.meta || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      documents.value.unshift(doc)
      success('Успех', 'Документ создан')
      return doc
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания документа'
      showError('Ошибка', errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Обновление документа
  const updateDocumentData = async (id: string, documentData: Partial<Document>) => {
    try {
      loading.value = true
      const updatedDoc = await updateDocument(id, {
        type: documentData.type || 'Документ',
        title: documentData.title || 'Документ',
        meta: documentData.meta || ''
      })
      const doc = {
        id: updatedDoc.id || '',
        type: updatedDoc.type || 'Документ',
        title: updatedDoc.title || 'Документ',
        meta: updatedDoc.meta || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      const index = documents.value.findIndex(doc => doc.id === id)
      if (index > -1) {
        documents.value[index] = doc
      }
      success('Успех', 'Документ обновлен')
      return doc
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления документа'
      showError('Ошибка', errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Удаление документа
  const removeDocument = async (id: string) => {
    try {
      loading.value = true
      await deleteDocument(id)
      documents.value = documents.value.filter(doc => doc.id !== id)
      success('Успех', 'Документ удален')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления документа'
      showError('Ошибка', errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Поиск
  const search = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  // Изменение страницы
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // Обновление размера страницы
  const changePageSize = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
  }

  return {
    // State
    documents: computed(() => documents.value),
    filteredDocuments: paginatedDocuments,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    searchQuery: computed(() => searchQuery.value),
    currentPage: computed(() => currentPage.value),
    totalPages: computed(() => totalPages.value),
    
    // Actions
    loadDocuments,
    createNewDocument,
    updateDocumentData,
    removeDocument,
    search,
    goToPage,
    changePageSize
  }
}

// Composable для создания документа с валидацией
export function useDocumentForm() {
  const { success, error } = useToast()
  
  const { data, errors, validate, validateFieldOnBlur, hasErrors, getFieldError, hasFieldError } = useValidation(
    {
      type: 'Документ',
      title: '',
      meta: ''
    },
    {
      type: {
        ...validationRules.required('Тип документа обязателен'),
        ...validationRules.minLength(2, 'Минимум 2 символа')
      },
      title: {
        ...validationRules.required('Заголовок обязателен'),
        ...validationRules.minLength(3, 'Минимум 3 символа'),
        ...validationRules.maxLength(255, 'Максимум 255 символов')
      },
      meta: {
        ...validationRules.required('Содержание обязательно')
      }
    }
  )

  const resetForm = () => {
    data.value = {
      type: 'Документ',
      title: '',
      meta: ''
    }
  }

  return {
    data,
    errors,
    validate,
    validateFieldOnBlur,
    hasErrors,
    getFieldError,
    hasFieldError,
    resetForm
  }
}
