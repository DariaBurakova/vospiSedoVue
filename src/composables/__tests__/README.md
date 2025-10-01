# Composables Tests

Этот каталог содержит unit тесты для composables.

## Структура

- `useValidation.test.ts` - тесты для валидации форм
- `useToast.test.ts` - тесты для toast уведомлений
- `useHotkeys.test.ts` - тесты для горячих клавиш

## Запуск тестов

```bash
# Запуск всех тестов
npm run test

# Запуск тестов в watch режиме
npm run test:ui

# Запуск тестов один раз
npm run test:run

# Запуск тестов с покрытием
npm run test:coverage
```

## Добавление новых тестов

1. Создайте файл `*.test.ts` в соответствующем каталоге
2. Импортируйте необходимые функции и composables
3. Напишите тесты используя `describe`, `it`, `expect`
4. Запустите тесты для проверки

## Пример теста

```typescript
import { describe, it, expect } from 'vitest'
import { useValidation } from '../useValidation'

describe('useValidation', () => {
  it('should validate required fields', () => {
    const { validate, getFieldError } = useValidation(
      { name: '' },
      { name: { required: true, message: 'Имя обязательно' } }
    )

    const isValid = validate()
    expect(isValid).toBe(false)
    expect(getFieldError('name')).toBe('Имя обязательно')
  })
})
```
