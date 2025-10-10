import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

export type ColumnId =
  | 'chat'
  | 'senderNumber'
  | 'date'
  | 'history'
  | 'organization'
  | 'signer'
  | 'position'
  | 'content'
  | 'delivery'
  | 'executeUntil'
  | 'incomingNumber'
  | 'incomingDate'
  | 'execution'
  | 'notes'
  | 'files'

export interface TablePrefsV2 {
  view?: string
  columns: ColumnId[]
  order?: ColumnId[]
  widths?: Record<ColumnId, number>
  version: number
  updatedAt: string
}

const ALL_COLUMNS: ColumnId[] = [
  'chat','senderNumber','date','history','organization','signer','position','content',
  'delivery','executeUntil','incomingNumber','incomingDate','execution','notes','files'
]

// Кэш состояний на уровень модуля: одно состояние на каждый view
const viewToState = new Map<string, { visibleColumns: Ref<Set<ColumnId>>; key: string; order: Ref<ColumnId[]>; widths: Ref<Partial<Record<ColumnId, number>>> }>()

export function useTablePreferences(viewName?: string) {
  const route = useRoute()
  const view = (viewName || String(route.name || 'inbox')) as string
  const key = `tableColumns:${view}`

  // Получаем или создаем общее состояние для view
  let state = viewToState.get(view)
  if (!state) {
    state = {
      visibleColumns: ref(new Set<ColumnId>(ALL_COLUMNS)) as Ref<Set<ColumnId>>,
      key,
      order: ref<ColumnId[]>([...ALL_COLUMNS]),
      widths: ref<Partial<Record<ColumnId, number>>>({ chat: 28 })
    }
    viewToState.set(view, state)
  }
  const visibleColumns = state.visibleColumns
  const order = state.order
  const widths = state.widths

  const normalizeColumns = (cols: string[] | undefined): ColumnId[] => {
    const safe = (cols || []).filter((c: string) => (ALL_COLUMNS as string[]).includes(c)) as ColumnId[]
    return safe.includes('chat') ? safe : (['chat', ...safe] as ColumnId[])
  }

  const normalizeOrder = (ord: string[] | undefined): ColumnId[] => {
    const candidate = (ord || ALL_COLUMNS) as string[]
    const filtered = candidate.filter((c) => (ALL_COLUMNS as string[]).includes(c)) as ColumnId[]
    // Гарантируем, что присутствуют все колонки в базовом порядке, отсутствующие — добавляем в конец
    const missing = ALL_COLUMNS.filter((c) => !filtered.includes(c))
    const merged = [...filtered, ...missing]
    // Чат — первым
    const withoutChat = merged.filter((c) => c !== 'chat')
    return ['chat', ...withoutChat]
  }

  const load = async () => {
    // 1) sessionStorage/localStorage
    try {
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key)
      if (raw) {
        const parsed: TablePrefsV2 = JSON.parse(raw)
        const validCols = normalizeColumns(parsed.columns)
        if (validCols.length > 0) {
          visibleColumns.value = new Set(validCols)
        }
        order.value = normalizeOrder(parsed.order as string[] | undefined)
        widths.value = { chat: 28, ...(parsed.widths as Partial<Record<ColumnId, number>> || {}) }
        return
      }
    } catch {}

    // 2) API (опционально)
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        const res = await fetch(`/api/ui/preferences/table?view=${encodeURIComponent(view)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = (await res.json()) as Partial<TablePrefsV2>
          const validCols = normalizeColumns((data.columns as string[] | undefined) || ALL_COLUMNS)
          visibleColumns.value = new Set(validCols)
          order.value = normalizeOrder(data.order as string[] | undefined)
          widths.value = { chat: 28, ...(data.widths as Partial<Record<ColumnId, number>> | undefined || {}) }
          return
        }
      }
    } catch {}

    // 3) defaults
    visibleColumns.value = new Set(ALL_COLUMNS)
    order.value = [...ALL_COLUMNS]
    widths.value = { chat: 28 }
  }

  const toggle = (id: ColumnId) => {
    const set = new Set(visibleColumns.value)
    if (set.has(id)) set.delete(id); else set.add(id)
    visibleColumns.value = set
  }

  const selectAll = () => { visibleColumns.value = new Set(ALL_COLUMNS) }
  const resetToDefault = () => { visibleColumns.value = new Set(ALL_COLUMNS); order.value = [...ALL_COLUMNS]; widths.value = { chat: 28 } }
  const deselectAll = () => { visibleColumns.value = new Set() }

  const setWidth = (id: ColumnId, px: number) => {
    if (id === 'chat') { widths.value.chat = 28; return }
    const clamped = Math.max(80, Math.min(640, Math.round(px)))
    widths.value = { ...widths.value, [id]: clamped }
  }

  const setOrder = (newOrder: ColumnId[]) => {
    const normalized = normalizeOrder(newOrder as string[])
    order.value = normalized
  }

  const save = async () => {
    // валидация: минимум 1 колонка
    if (visibleColumns.value.size === 0) {
      throw new Error('Нужно выбрать минимум одну колонку')
    }

    const payload: TablePrefsV2 = {
      view,
      columns: Array.from(visibleColumns.value),
      order: order.value,
      widths: widths.value as Record<ColumnId, number>,
      version: 2,
      updatedAt: new Date().toISOString()
    }
    // локально
    sessionStorage.setItem(key, JSON.stringify(payload))
    localStorage.setItem(key, JSON.stringify(payload))

    const token = localStorage.getItem('access_token')
    if (!token) return

    try {
      await fetch('/api/ui/preferences/table', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
    } catch {}
  }

  return { ALL_COLUMNS, visibleColumns, order, widths, load, toggle, selectAll, resetToDefault, deselectAll, save, setWidth, setOrder, view }
}
