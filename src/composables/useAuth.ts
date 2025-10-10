import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import { login, logout } from '@/api/auth'
import { useToast } from './useToast'
import { useValidation, validationRules } from './useValidation'

export interface User {
  id: string
  username: string
  email?: string
  role?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export function useAuth() {
  const router = useRouter()
  const { success, error } = useToast()
  
  const user = ref<User | null>(null)
  const loading = ref(false)
  const isAuthenticated = computed(() => !!user.value)
  const token = computed(() => localStorage.getItem('access_token'))

  // Проверка токена при инициализации
  const initAuth = () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      const storedRole = localStorage.getItem('user_role') || 'user'
      const storedUsername = localStorage.getItem('username') || 'user'
      user.value = {
        id: '1',
        username: storedUsername,
        role: storedRole
      }
    }
  }

  // Вход в систему
  const loginUser = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      const response = { access_token: 'mock_token' }
      
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        // временно все логины = admin; при реальном API сюда придет роль
        const role = credentials.username === 'admin' ? 'admin' : 'user'
        localStorage.setItem('user_role', role)
        localStorage.setItem('username', credentials.username)
        user.value = {
          id: '1',
          username: credentials.username,
          role
        }
        success('Успех', 'Вы успешно вошли в систему')
        return true
      }
      return false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа в систему'
      error('Ошибка', errorMessage)
      return false
    } finally {
      loading.value = false
    }
  }

  // Выход из системы
  const logoutUser = async () => {
    try {
      loading.value = true
    } catch (err) {
      console.warn('Ошибка при выходе:', err)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('username')
      user.value = null
      loading.value = false
      success('Успех', 'Вы вышли из системы')
      router.push('/')
    }
  }

  // Проверка роли
  const hasRole = (role: string) => {
    return user.value?.role === role
  }

  // Проверка прав доступа
  const hasPermission = (permission: string) => {
    // В реальном приложении здесь была бы проверка прав пользователя
    return isAuthenticated.value
  }

  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    token,
    initAuth,
    loginUser,
    logoutUser,
    hasRole,
    hasPermission
  }
}

// Composable для формы входа с валидацией
export function useLoginForm() {
  const { success, error } = useToast()
  
  const { data, errors, validate, validateFieldOnBlur, hasErrors, getFieldError, hasFieldError } = useValidation(
    {
      username: '',
      password: ''
    },
    {
      username: {
        ...validationRules.required('Имя пользователя обязательно'),
        ...validationRules.minLength(3, 'Минимум 3 символа')
      },
      password: {
        ...validationRules.required('Пароль обязателен'),
        ...validationRules.minLength(3, 'Минимум 3 символа')
      }
    }
  )

  const resetForm = () => {
    data.value = {
      username: '',
      password: ''
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
