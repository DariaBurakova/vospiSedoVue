import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    // Очищаем toasts перед каждым тестом
    const { toasts } = useToast()
    toasts.value = []
  })

  it('should add success toast', () => {
    const { success, toasts } = useToast()
    
    success('Успех', 'Операция выполнена')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].type).toBe('success')
    expect(toasts.value[0].title).toBe('Успех')
    expect(toasts.value[0].message).toBe('Операция выполнена')
  })

  it('should add error toast', () => {
    const { error, toasts } = useToast()
    
    error('Ошибка', 'Что-то пошло не так')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].type).toBe('error')
    expect(toasts.value[0].title).toBe('Ошибка')
    expect(toasts.value[0].message).toBe('Что-то пошло не так')
  })

  it('should add warning toast', () => {
    const { warning, toasts } = useToast()
    
    warning('Предупреждение', 'Обратите внимание')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].type).toBe('warning')
    expect(toasts.value[0].title).toBe('Предупреждение')
    expect(toasts.value[0].message).toBe('Обратите внимание')
  })

  it('should add info toast', () => {
    const { info, toasts } = useToast()
    
    info('Информация', 'Полезная информация')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].type).toBe('info')
    expect(toasts.value[0].title).toBe('Информация')
    expect(toasts.value[0].message).toBe('Полезная информация')
  })

  it('should add toast without message', () => {
    const { success, toasts } = useToast()
    
    success('Успех')
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].title).toBe('Успех')
    expect(toasts.value[0].message).toBeUndefined()
  })

  it('should add multiple toasts', () => {
    const { success, error, toasts } = useToast()
    
    success('Успех 1')
    error('Ошибка 1')
    success('Успех 2')
    
    expect(toasts.value).toHaveLength(3)
    expect(toasts.value[0].title).toBe('Успех 1')
    expect(toasts.value[1].title).toBe('Ошибка 1')
    expect(toasts.value[2].title).toBe('Успех 2')
  })

  it('should remove toast by id', () => {
    const { success, removeToast, toasts } = useToast()
    
    success('Успех 1')
    success('Успех 2')
    
    expect(toasts.value).toHaveLength(2)
    
    const firstToastId = toasts.value[0].id
    removeToast(firstToastId)
    
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].title).toBe('Успех 2')
  })

  it('should generate unique ids for toasts', () => {
    const { success, toasts } = useToast()
    
    success('Успех 1')
    success('Успех 2')
    
    expect(toasts.value[0].id).not.toBe(toasts.value[1].id)
  })

  it('should set custom duration', () => {
    const { addToast, toasts } = useToast()
    
    addToast({
      type: 'info',
      title: 'Тест',
      duration: 10000
    })
    
    expect(toasts.value[0].duration).toBe(10000)
  })
})
