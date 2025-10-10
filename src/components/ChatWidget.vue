<template>
  <div class="chat-widget">
    <!-- Заголовок чата -->
    <div class="chat-header">
      <div class="chat-title">
        <div class="user-info">
          <div class="avatar">
            <span>{{ getRoomInitials(activeRoom) }}</span>
          </div>
          <div class="user-details">
            <h4 class="user-name">{{ getRoomName(activeRoom) }}</h4>
            <div class="connection-status">
              <span class="status-dot" :class="{ 'online': isConnected }"></span>
              <span class="status-text">{{ isConnected ? 'В сети' : 'Не в сети' }}</span>
            </div>
          </div>
        </div>
        <div class="chat-actions">
          <button class="action-btn" title="Поиск">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button class="action-btn" title="Меню">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
          <button @click="emit('close')" class="close-btn" title="Закрыть чат">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
      
    <!-- Область сообщений -->
    <div class="chat-body">
      <div ref="messagesContainer" class="messages-container">
        <!-- Индикатор загрузки истории сообщений из базы данных -->
        <div v-if="isLoadingHistory" class="loading-indicator">
          <div class="loading-spinner"></div>
          <span>Загрузка истории сообщений...</span>
        </div>
        
        <!-- Состояние пустого чата (когда нет сообщений) -->
        <div v-else-if="messages.length === 0" class="empty-chat">
          <div class="empty-icon">💬</div>
          <p>Пока нет сообщений</p>
          <small>Начните общение!</small>
        </div>
        
        <!-- Сообщения -->
        <div v-else v-for="message in messages" 
             :key="message.id"
             class="message-item"
             :class="{ 'own': message.user_id === currentUserId }">
          <div class="message-wrapper">
            <div class="message-avatar" v-if="message.user_id !== currentUserId">
              <span>{{ getMessageInitials(message.username) }}</span>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ message.username }}</span>
                <span class="message-time">{{ formatTime(message.created_at) }}</span>
              </div>
              <div class="message-bubble">
                <p class="message-text">{{ message.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Поле ввода -->
    <div class="chat-footer">
      <div class="message-input-container">
        <div class="input-wrapper">
          <button class="attach-btn" title="Прикрепить файл">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"></path>
            </svg>
          </button>
          <textarea
            ref="messageInput"
            v-model="messageText"
            @keydown.enter.prevent="sendMessage"
            @input="handleInput"
            @blur="() => {}"
            placeholder="Напишите сообщение..."
            class="message-input"
            rows="1"
            :disabled="!isConnected"
          ></textarea>
          <button class="emoji-btn" title="Эмодзи">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 9 1.5 1.5L12 9l1.5 1.5L15 9"></path>
              <path d="m9 15 1.5-1.5L12 15l1.5-1.5L15 15"></path>
            </svg>
          </button>
        </div>
        <button 
          @click="sendMessage"
          :disabled="!messageText.trim() || !isConnected"
          class="send-btn"
          title="Отправить сообщение">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

console.log('ChatWidget script setup started')

interface Props {
  roomId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

console.log('ChatWidget props:', props)

// WebSocket подключение
let ws: WebSocket | null = null

// Подключение к WebSocket
const connectWebSocket = () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.log('No token found for WebSocket connection')
      return
    }
    
    const wsUrl = `ws://localhost:1990/ws?token=${encodeURIComponent(token)}&room=${encodeURIComponent(activeRoom.value || '')}`
    console.log('Connecting to WebSocket:', wsUrl)
    
    ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      isConnected.value = true
      
      // Подписываемся на комнату
      if (activeRoom.value) {
        ws?.send(JSON.stringify({
          type: 'subscribe',
          room: activeRoom.value
        }))
      }
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('WebSocket message received:', data)
        
        if (data.type === 'message' && data.payload) {
          // Добавляем новое сообщение в UI
          const message = {
            id: data.payload.id || Date.now().toString(),
            user_id: data.payload.user_id,
            username: data.payload.username,
            text: data.payload.text,
            created_at: new Date().toISOString()
          }
          messages.value.push(message)
          scrollToBottom()
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      isConnected.value = false
      
      // Переподключение через 3 секунды
      setTimeout(() => {
        if (activeRoom.value) {
          connectWebSocket()
        }
      }, 3000)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      isConnected.value = false
    }
  } catch (error) {
    console.error('Error connecting to WebSocket:', error)
  }
}

// Отключение от WebSocket
const disconnectWebSocket = () => {
  if (ws) {
    ws.close()
    ws = null
  }
}

// Состояние чата
const activeRoom = ref<string | null>(null)
const messages = ref<any[]>([])
const messageText = ref('')
const messageInput = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLDivElement>()
const isConnected = ref(false)
const isLoadingHistory = ref(false)

// Текущий пользователь
const currentUserId = ref<string>('00000000-0000-0000-0000-000000000000')
const currentUsername = ref<string>('user')

// Инициализация текущего пользователя
const initCurrentUser = () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      currentUserId.value = payload.sub || currentUserId.value
      currentUsername.value = payload.username || currentUsername.value
      console.log(`Current user: ${currentUsername.value} (${currentUserId.value})`)
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }
}

// Загрузка истории сообщений
const loadHistory = async (roomId: string) => {
  console.log(`Loading history for room: ${roomId}`)
  isLoadingHistory.value = true
  
  try {
    const token = localStorage.getItem('access_token')
    if (token) {
      const url = `http://localhost:1990/api/chat/history?room=${encodeURIComponent(roomId)}&limit=50`
      console.log(`Fetching from URL: ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log(`API response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API response data:', data)
        console.log('Data type:', Array.isArray(data) ? 'array' : typeof data)
        
        // Проверяем, что это массив (API возвращает массив напрямую, не объект с полем messages)
        if (Array.isArray(data)) {
          // Преобразуем timestamp в ISO строку и сортируем по времени
          messages.value = data
            .map(msg => ({
              ...msg,
              created_at: new Date(msg.created_at).toISOString()
            }))
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          
          console.log(`Loaded ${messages.value.length} messages from database for room ${roomId}`)
        } else {
          console.error('Invalid API response format - expected array, got:', typeof data)
          messages.value = []
        }
      } else {
        console.error('Failed to load chat history:', response.status, response.statusText)
        messages.value = []
      }
    } else {
      console.log('No token found, showing empty chat')
      messages.value = []
    }
  } catch (error) {
    console.error('Error loading chat history:', error)
    messages.value = []
  } finally {
    isLoadingHistory.value = false
  }
}

// Загрузка тестовых сообщений (удалена - больше не используется)

// Отправка сообщения
const sendChatMessage = async (roomId: string, text: string) => {
  console.log(`Sending message to room ${roomId}:`, text)
  
  // Получаем информацию о пользователе из JWT токена
  const token = localStorage.getItem('access_token')
  let userId = currentUserId.value
  let username = currentUsername.value
  
  if (token) {
    try {
      // Декодируем JWT токен (только payload, без проверки подписи)
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.sub || userId
      username = payload.username || username
      console.log(`Sending message as user: ${username} (${userId})`)
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }
  
  const newMessage = {
    id: `msg-${Date.now()}`,
    user_id: userId,
    username: username,
    text: text,
    created_at: new Date().toISOString(),
    meta: {}
  }
  
  messages.value.push(newMessage)
  console.log(`Added message to room ${roomId}, total: ${messages.value.length}`)
  
  // Также отправляем через WebSocket для реального времени
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'message',
      room: roomId,
      payload: {
        text: text
      }
    }))
    console.log('Message sent via WebSocket')
  }
}

// Подписка на комнату
const joinRoom = async (roomId: string) => {
  console.log(`Joining room: ${roomId}`)
  
  // Инициализируем текущего пользователя
  initCurrentUser()
  
  activeRoom.value = roomId
  
  // Загружаем историю сообщений
  await loadHistory(roomId)
  
  // Подключаемся к WebSocket
  connectWebSocket()
}

// Отправка сообщения
const sendMessage = async () => {
  if (!messageText.value.trim() || !activeRoom.value) return
  
  const text = messageText.value.trim()
  messageText.value = ''
  
  console.log('Sending message:', text)
  await sendChatMessage(activeRoom.value, text)
  
  // Автоматический скролл
  scrollToBottom()
}

// Обработка ввода текста
const handleInput = () => {
  console.log('User is typing...')
}

// Получение инициалов комнаты
const getRoomInitials = (roomId: string | null) => {
  if (!roomId) return 'Ч'
  const parts = roomId.split(':')
  if (parts.length >= 3) {
    const name = parts[2]
    return name.substring(0, 2).toUpperCase()
  }
  return 'Ч'
}

// Получение имени комнаты
const getRoomName = (roomId: string | null) => {
  if (!roomId) return 'Выберите чат'
  const parts = roomId.split(':')
  if (parts.length >= 3) {
    return parts[2]
  }
  return roomId
}

// Форматирование времени
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Получение инициалов сообщения
const getMessageInitials = (username: string) => {
  if (!username) return 'U'
  return username.substring(0, 2).toUpperCase()
}

// Автоматический скролл к последнему сообщению
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Инициализация
onMounted(() => {
  console.log('ChatWidget onMounted called')
  console.log('props.roomId:', props.roomId)
  if (props.roomId) {
    console.log('Calling joinRoom with:', props.roomId)
    joinRoom(props.roomId)
  } else {
    console.log('No roomId provided')
  }
  
  // Автоматический скролл при новых сообщениях
  const observer = new MutationObserver(scrollToBottom)
  if (messagesContainer.value) {
    observer.observe(messagesContainer.value, { childList: true })
  }
  
  // Очистка при размонтировании
  onBeforeUnmount(() => {
    observer.disconnect()
    disconnectWebSocket()
  })
})
</script>

<style scoped>
/* Chatvia-inspired design */
.chat-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 800px; /* Увеличиваем ширину в два раза (было примерно 400px) */
  max-width: 90vw; /* Ограничиваем максимальную ширину */
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 18px;
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #4779b7 0%, #274364 100%);
  padding: 16px 20px;
  color: white;
}

.chat-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
  backdrop-filter: blur(10px);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.9;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.status-dot.online {
  background: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn, .close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover, .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Chat Body */
.chat-body {
  flex: 1;
  background: #f8fafc;
  overflow: hidden;
}

.messages-container {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Messages */
.message-item {
  display: flex;
  margin-bottom: 8px;
}

.message-item.own {
  justify-content: flex-end;
}

.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 70%;
}

.message-item.own .message-wrapper {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4779b7 0%, #274364 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.sender-name {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.message-time {
  font-size: 10px;
  color: #94a3b8;
}

.message-bubble {
  background: white;
  border-radius: 18px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.message-item.own .message-bubble {
  background: linear-gradient(135deg, #4779b7 0%, #274364 100%);
  color: white;
  border: none;
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #334155;
}

.message-item.own .message-text {
  color: white;
}

/* Chat Footer */
.chat-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 20px;
}

.message-input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-radius: 25px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.message-input-container:focus-within {
  border-color: #4779b7;
  box-shadow: 0 0 0 3px rgba(71, 121, 183, 0.1);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex: 1;
}

.attach-btn, .emoji-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attach-btn:hover, .emoji-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.message-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  outline: none;
  color: #334155;
  min-height: 20px;
  max-height: 120px;
  font-family: 'Inter', sans-serif;
}

.message-input::placeholder {
  color: #94a3b8;
}

.send-btn {
  background: linear-gradient(135deg, #4779b7 0%, #274364 100%);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(71, 121, 183, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(71, 121, 183, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Индикаторы состояния чата */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #64748b;
  font-size: 14px;
  gap: 12px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #4779b7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #64748b;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-chat p {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #475569;
}

.empty-chat small {
  font-size: 14px;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-widget {
    border-radius: 0;
    height: 100vh;
  }
  
  .chat-header {
    padding: 16px;
  }
  
  .messages-container {
    padding: 16px;
  }
  
  .chat-footer {
    padding: 16px;
  }
}
</style>
