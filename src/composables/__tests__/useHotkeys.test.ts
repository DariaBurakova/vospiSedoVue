import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHotkeys, commonHotkeys } from '../useHotkeys'

describe('useHotkeys', () => {
  let mockHandler: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockHandler = vi.fn()
  })

  it('should register and trigger hotkey', () => {
    const { register } = useHotkeys()
    
    register({
      key: 'a',
      handler: mockHandler
    })

    // Simulate keydown event
    const event = new KeyboardEvent('keydown', { key: 'a' })
    document.dispatchEvent(event)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should register and trigger hotkey with modifiers', () => {
    const { register } = useHotkeys()
    
    register({
      key: 's',
      ctrl: true,
      handler: mockHandler
    })

    // Simulate Ctrl+S keydown event
    const event = new KeyboardEvent('keydown', { 
      key: 's',
      ctrlKey: true
    })
    document.dispatchEvent(event)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should not trigger hotkey without modifiers', () => {
    const { register } = useHotkeys()
    
    register({
      key: 's',
      ctrl: true,
      handler: mockHandler
    })

    // Simulate S keydown event without Ctrl
    const event = new KeyboardEvent('keydown', { key: 's' })
    document.dispatchEvent(event)

    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should prevent default when configured', () => {
    const { register } = useHotkeys()
    
    register({
      key: 's',
      ctrl: true,
      preventDefault: true,
      handler: mockHandler
    })

    const event = new KeyboardEvent('keydown', { 
      key: 's',
      ctrlKey: true
    })
    
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should stop propagation when configured', () => {
    const { register } = useHotkeys()
    
    register({
      key: 's',
      ctrl: true,
      stopPropagation: true,
      handler: mockHandler
    })

    const event = new KeyboardEvent('keydown', { 
      key: 's',
      ctrlKey: true
    })
    
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')
    document.dispatchEvent(event)

    expect(stopPropagationSpy).toHaveBeenCalled()
  })

  it('should unregister hotkey', () => {
    const { register, unregister } = useHotkeys()
    
    const config = {
      key: 'a',
      handler: mockHandler
    }
    
    register(config)
    unregister(config)

    const event = new KeyboardEvent('keydown', { key: 'a' })
    document.dispatchEvent(event)

    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should handle case insensitive keys', () => {
    const { register } = useHotkeys()
    
    register({
      key: 'A',
      handler: mockHandler
    })

    // Simulate lowercase 'a' keydown event
    const event = new KeyboardEvent('keydown', { key: 'a' })
    document.dispatchEvent(event)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple modifiers', () => {
    const { register } = useHotkeys()
    
    register({
      key: 'z',
      ctrl: true,
      shift: true,
      handler: mockHandler
    })

    const event = new KeyboardEvent('keydown', { 
      key: 'z',
      ctrlKey: true,
      shiftKey: true
    })
    document.dispatchEvent(event)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})

describe('commonHotkeys', () => {
  let mockHandler: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockHandler = vi.fn()
  })

  it('should create createDocument hotkey', () => {
    const config = commonHotkeys.createDocument(mockHandler)
    
    expect(config.key).toBe('n')
    expect(config.ctrl).toBe(true)
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Создать новый документ')
  })

  it('should create search hotkey', () => {
    const config = commonHotkeys.search(mockHandler)
    
    expect(config.key).toBe('f')
    expect(config.ctrl).toBe(true)
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Открыть поиск')
  })

  it('should create save hotkey', () => {
    const config = commonHotkeys.save(mockHandler)
    
    expect(config.key).toBe('s')
    expect(config.ctrl).toBe(true)
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Сохранить')
  })

  it('should create cancel hotkey', () => {
    const config = commonHotkeys.cancel(mockHandler)
    
    expect(config.key).toBe('Escape')
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Отмена/Закрыть')
  })

  it('should create delete hotkey', () => {
    const config = commonHotkeys.delete(mockHandler)
    
    expect(config.key).toBe('Delete')
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Удалить выбранное')
  })

  it('should create refresh hotkey', () => {
    const config = commonHotkeys.refresh(mockHandler)
    
    expect(config.key).toBe('r')
    expect(config.ctrl).toBe(true)
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Обновить')
  })

  it('should create help hotkey', () => {
    const config = commonHotkeys.help(mockHandler)
    
    expect(config.key).toBe('F1')
    expect(config.preventDefault).toBe(true)
    expect(config.description).toBe('Помощь')
  })
})
