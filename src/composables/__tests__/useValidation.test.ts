import { describe, it, expect, beforeEach } from 'vitest'
import { useValidation, validationRules } from '../useValidation'

describe('useValidation', () => {
  it('should validate required fields', () => {
    const { data, validate, getFieldError } = useValidation(
      { name: '', email: '' },
      {
        name: validationRules.required('Имя обязательно'),
        email: validationRules.required('Email обязателен')
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(false)
    expect(getFieldError('name')).toBe('Имя обязательно')
    expect(getFieldError('email')).toBe('Email обязателен')
  })

  it('should validate min length', () => {
    const { data, validate, getFieldError } = useValidation(
      { password: '12' },
      {
        password: validationRules.minLength(6, 'Минимум 6 символов')
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(false)
    expect(getFieldError('password')).toBe('Минимум 6 символов')
  })

  it('should validate max length', () => {
    const { data, validate, getFieldError } = useValidation(
      { title: 'a'.repeat(256) },
      {
        title: validationRules.maxLength(255, 'Максимум 255 символов')
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(false)
    expect(getFieldError('title')).toBe('Максимум 255 символов')
  })

  it('should validate email format', () => {
    const { data, validate, getFieldError } = useValidation(
      { email: 'invalid-email' },
      {
        email: validationRules.email('Неверный формат email')
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(false)
    expect(getFieldError('email')).toBe('Неверный формат email')
  })

  it('should validate phone format', () => {
    const { data, validate, getFieldError } = useValidation(
      { phone: 'invalid-phone' },
      {
        phone: validationRules.phone('Неверный формат телефона')
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(false)
    expect(getFieldError('phone')).toBe('Неверный формат телефона')
  })

  it('should validate custom rules', () => {
    const { data, validate, getFieldError } = useValidation(
      { age: 15 },
      {
        age: {
          custom: (value) => value < 18 ? 'Возраст должен быть не менее 18 лет' : null
        }
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(false)
    expect(getFieldError('age')).toBe('Возраст должен быть не менее 18 лет')
  })

  it('should pass validation for valid data', () => {
    const { data, validate } = useValidation(
      { 
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        name: validationRules.required(),
        email: validationRules.email(),
        password: validationRules.minLength(6)
      }
    )

    const isValid = validate()
    
    expect(isValid).toBe(true)
  })

  it('should clear errors', () => {
    const { data, validate, clearErrors, hasErrors } = useValidation(
      { name: '' },
      {
        name: validationRules.required()
      }
    )

    validate()
    expect(hasErrors.value).toBe(true)
    
    clearErrors()
    expect(hasErrors.value).toBe(false)
  })

  it('should validate field on blur', () => {
    const { data, validateFieldOnBlur, getFieldError } = useValidation(
      { name: '' },
      {
        name: validationRules.required('Имя обязательно')
      }
    )

    validateFieldOnBlur('name')
    expect(getFieldError('name')).toBe('Имя обязательно')
  })
})
