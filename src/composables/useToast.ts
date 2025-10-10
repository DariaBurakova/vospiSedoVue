import { ref } from 'vue'

// Компонент уведомлений (toast): очередь тостов и удобные хелперы
export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  // Добавить тост в очередь
  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    toasts.value.push({ ...toast, id })
  }

  // Удалить тост по id
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Хелперы для типовых состояний UI
  const success = (title: string, message?: string, duration = 5000) => {
    addToast({ type: 'success', title, message, duration })
  }

  const error = (title: string, message?: string, duration = 7000) => {
    addToast({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message?: string, duration = 6000) => {
    addToast({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message?: string, duration = 5000) => {
    addToast({ type: 'info', title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
