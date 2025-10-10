import { ref, computed } from 'vue'

// useValidation — универсальная валидация форм
// Возвращает реактивные данные, ошибки и хелперы для полной/поштучной проверки
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  message?: string
}

export interface ValidationErrors {
  [key: string]: string[]
}

export function useValidation<T extends Record<string, any>>(
  initialData: T,
  rules: Record<keyof T, ValidationRule>
) {
  const data = ref<T>({ ...initialData })
  const errors = ref<ValidationErrors>({})
  const touched = ref<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  // Проверка одного поля по правилу
  const validateField = (field: keyof T, value: any): string[] => {
    const fieldRules = rules[field]
    if (!fieldRules) return []

    const fieldErrors: string[] = []

    // Обязательное поле
    if (fieldRules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      fieldErrors.push(fieldRules.message || `${String(field)} обязательно для заполнения`)
    }

    // Если поле не обязательно и пусто — остальные проверки пропускаем
    if (!value && !fieldRules.required) {
      return fieldErrors
    }

    // Мин. длина
    if (fieldRules.minLength && typeof value === 'string' && value.length < fieldRules.minLength) {
      fieldErrors.push(fieldRules.message || `Минимум ${fieldRules.minLength} символов`)
    }

    // Макс. длина
    if (fieldRules.maxLength && typeof value === 'string' && value.length > fieldRules.maxLength) {
      fieldErrors.push(fieldRules.message || `Максимум ${fieldRules.maxLength} символов`)
    }

    // Паттерн
    if (fieldRules.pattern && typeof value === 'string' && !fieldRules.pattern.test(value)) {
      fieldErrors.push(fieldRules.message || `Неверный формат ${String(field)}`)
    }

    // Кастомная проверка
    if (fieldRules.custom) {
      const customError = fieldRules.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    return fieldErrors
  }

  // Полная проверка формы
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(rules).forEach(field => {
      const fieldErrors = validateField(field as keyof T, data.value[field as keyof T])
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors
        isValid = false
      }
    })

    errors.value = newErrors
    return isValid
  }

  // Проверка поля по блюру
  const validateFieldOnBlur = (field: keyof T) => {
    touched.value[field] = true
    const fieldErrors = validateField(field, data.value[field])
    if (fieldErrors.length > 0) {
      errors.value[field as string] = fieldErrors
    } else {
      delete errors.value[field as string]
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const clearFieldError = (field: keyof T) => {
    delete errors.value[field as string]
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  const getFieldError = (field: keyof T) => {
    return errors.value[field as string]?.[0] || null
  }

  const hasFieldError = (field: keyof T) => {
    return !!errors.value[field as string]?.length
  }

  return {
    data,
    errors,
    touched,
    validate,
    validateFieldOnBlur,
    clearErrors,
    clearFieldError,
    hasErrors,
    getFieldError,
    hasFieldError
  }
}

// Набор предустановленных правил валидации под частые кейсы
export const validationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || 'Поле обязательно для заполнения'
  }),
  
  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || 'Введите корректный email'
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    message: message || `Минимум ${min} символов`
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    message: message || `Максимум ${max} символов`
  }),
  
  phone: (message?: string): ValidationRule => ({
    pattern: /^[\+]?[^\D][\d]{0,15}$/,
    message: message || 'Введите корректный номер телефона'
  }),
  
  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/, 
    message: message || 'Введите корректный URL'
  })
}
