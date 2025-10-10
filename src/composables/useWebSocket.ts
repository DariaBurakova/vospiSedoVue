import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuth } from './useAuth'

export interface WSMessage {
  type: string
  room: string
  payload: any
  ts: number
}

export interface ChatMessage {
  id: string
  user_id: string
  username: string
  text: string
  created_at?: string
}

export interface TypingUser {
  user_id: string
  username: string
  state: 'start' | 'stop'
}

class WSClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private maxReconnectDelay = 30000
  private heartbeatInterval: number | null = null
  private outbox: WSMessage[] = []
  private rooms = new Set<string>()
  private messageHandlers = new Map<string, (payload: any) => void>()
  private connectionState = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  private lastError = ref<string | null>(null)

  constructor() {
    this.setupMessageHandlers()
  }

  private setupMessageHandlers() {
    this.messageHandlers.set('message', (payload: ChatMessage) => {
      // Эмитим событие для компонентов
      window.dispatchEvent(new CustomEvent('chat:message', { detail: payload }))
    })

    this.messageHandlers.set('typing', (payload: TypingUser) => {
      window.dispatchEvent(new CustomEvent('chat:typing', { detail: payload }))
    })

    this.messageHandlers.set('error', (payload: { message: string }) => {
      this.lastError.value = payload.message
      window.dispatchEvent(new CustomEvent('chat:error', { detail: payload }))
    })

    this.messageHandlers.set('ack', (payload: { message_id: string }) => {
      window.dispatchEvent(new CustomEvent('chat:ack', { detail: payload }))
    })
  }

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.connectionState.value = 'connecting'
    this.lastError.value = null

    try {
      const wsUrl = `ws://localhost:1990/ws?token=${encodeURIComponent(token)}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.connectionState.value = 'connected'
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.flushOutbox()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        this.connectionState.value = 'disconnected'
        this.stopHeartbeat()
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(token)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.connectionState.value = 'error'
        this.lastError.value = 'WebSocket connection error'
      }

    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      this.connectionState.value = 'error'
      this.lastError.value = 'Failed to create WebSocket connection'
    }
  }

  private handleMessage(message: WSMessage) {
    const handler = this.messageHandlers.get(message.type)
    if (handler) {
      handler(message.payload)
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', ts: Date.now() }))
      }
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private scheduleReconnect(token: string) {
    this.reconnectAttempts++
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay)
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect(token)
    }, delay)
  }

  private flushOutbox() {
    while (this.outbox.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.outbox.shift()
      if (message) {
        this.ws.send(JSON.stringify(message))
      }
    }
  }

  subscribe(rooms: string[]) {
    const message: WSMessage = {
      type: 'subscribe',
      room: '',
      payload: { rooms },
      ts: Date.now()
    }

    rooms.forEach(room => this.rooms.add(room))

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.outbox.push(message)
    }
  }

  unsubscribe(rooms: string[]) {
    const message: WSMessage = {
      type: 'unsubscribe',
      room: '',
      payload: { rooms },
      ts: Date.now()
    }

    rooms.forEach(room => this.rooms.delete(room))

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.outbox.push(message)
    }
  }

  sendMessage(room: string, text: string) {
    const message: WSMessage = {
      type: 'message',
      room,
      payload: { text },
      ts: Date.now()
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.outbox.push(message)
    }
  }

  sendTyping(room: string, state: 'start' | 'stop') {
    const message: WSMessage = {
      type: 'typing',
      room,
      payload: { state },
      ts: Date.now()
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.connectionState.value = 'disconnected'
    this.rooms.clear()
    this.outbox = []
  }

  getConnectionState() {
    return this.connectionState.value
  }

  getLastError() {
    return this.lastError.value
  }

  isConnected() {
    return this.connectionState.value === 'connected'
  }
}

// Singleton instance
const wsClient = new WSClient()

export function useWebSocket() {
  const { token } = useAuth()

  const connect = () => {
    if (token.value) {
      wsClient.connect(token.value)
    }
  }

  const disconnect = () => {
    wsClient.disconnect()
  }

  const subscribe = (rooms: string[]) => {
    wsClient.subscribe(rooms)
  }

  const unsubscribe = (rooms: string[]) => {
    wsClient.unsubscribe(rooms)
  }

  const sendMessage = (room: string, text: string) => {
    wsClient.sendMessage(room, text)
  }

  const sendTyping = (room: string, state: 'start' | 'stop') => {
    wsClient.sendTyping(room, state)
  }

  const connectionState = computed(() => wsClient.getConnectionState())
  const lastError = computed(() => wsClient.getLastError())
  const isConnected = computed(() => wsClient.isConnected())

  onMounted(() => {
    connect()
  })

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    sendTyping,
    connectionState,
    lastError,
    isConnected
  }
}
