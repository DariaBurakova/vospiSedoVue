import { onMounted, onUnmounted } from 'vue'

export interface HotkeyConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  handler: () => void
  description?: string
}

// Глобальный реестр горячих клавиш (по ключу ctrl+shift+...+key)
const hotkeys = new Map<string, HotkeyConfig>()

// useHotkeys — регистрация/снятие горячих клавиш с автоматической очисткой
export function useHotkeys() {
  const register = (config: HotkeyConfig) => {
    const key = createKeyString(config)
    hotkeys.set(key, config)
  }

  const unregister = (config: HotkeyConfig) => {
    const key = createKeyString(config)
    hotkeys.delete(key)
  }

  const createKeyString = (config: HotkeyConfig): string => {
    const modifiers = []
    if (config.ctrl) modifiers.push('ctrl')
    if (config.shift) modifiers.push('shift')
    if (config.alt) modifiers.push('alt')
    if (config.meta) modifiers.push('meta')
    
    return [...modifiers, config.key.toLowerCase()].join('+')
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const modifiers = []
    if (event.ctrlKey) modifiers.push('ctrl')
    if (event.shiftKey) modifiers.push('shift')
    if (event.altKey) modifiers.push('alt')
    if (event.metaKey) modifiers.push('meta')
    
    const key = [...modifiers, event.key.toLowerCase()].join('+')
    const config = hotkeys.get(key)
    
    if (config) {
      if (config.preventDefault) {
        event.preventDefault()
      }
      if (config.stopPropagation) {
        event.stopPropagation()
      }
      config.handler()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    register,
    unregister
  }
}

// Предустановленные горячие клавиши для типичных действий UI
export const commonHotkeys = {
  // Создание документа
  createDocument: (handler: () => void) => ({
    key: 'n',
    ctrl: true,
    preventDefault: true,
    handler,
    description: 'Создать новый документ'
  }),
  
  // Поиск
  search: (handler: () => void) => ({
    key: 'f',
    ctrl: true,
    preventDefault: true,
    handler,
    description: 'Открыть поиск'
  }),
  
  // Сохранить
  save: (handler: () => void) => ({
    key: 's',
    ctrl: true,
    preventDefault: true,
    handler,
    description: 'Сохранить'
  }),
  
  // Отмена/Закрыть
  cancel: (handler: () => void) => ({
    key: 'Escape',
    preventDefault: true,
    handler,
    description: 'Отмена/Закрыть'
  }),
  
  // Удалить
  delete: (handler: () => void) => ({
    key: 'Delete',
    preventDefault: true,
    handler,
    description: 'Удалить выбранное'
  }),
  
  // Обновить/Обновить страницу
  refresh: (handler: () => void) => ({
    key: 'r',
    ctrl: true,
    preventDefault: true,
    handler,
    description: 'Обновить'
  }),
  
  // Помощь
  help: (handler: () => void) => ({
    key: 'F1',
    preventDefault: true,
    handler,
    description: 'Помощь'
  })
}
