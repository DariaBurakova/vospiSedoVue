<template>
  <div class="notifications-container">
    <!-- Bell иконка с бейджем -->
    <button 
      @click="toggleNotifications"
      class="bell-btn"
      :class="{ 'has-notifications': unreadCount > 0 }"
      aria-label="Уведомления">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.066 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.066A11.72 11.72 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"/>
      </svg>
      <div v-if="unreadCount > 0" class="notification-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </button>

    <!-- Панель уведомлений -->
    <div v-if="isOpen" class="notifications-panel">
      <div class="notifications-header">
        <h3>Уведомления</h3>
        <button @click="markAllAsRead" class="mark-all-btn" v-if="unreadCount > 0">
          Отметить все как прочитанные
        </button>
      </div>
      
      <div class="notifications-list">
        <div v-if="notifications.length === 0" class="empty-state">
          <p>Нет уведомлений</p>
        </div>
        
        <div v-for="notification in notifications" 
             :key="notification.id"
             class="notification-item"
             :class="{ 'unread': !notification.read }"
             @click="handleNotificationClick(notification)">
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
          <div v-if="!notification.read" class="unread-indicator"></div>
        </div>
      </div>
    </div>

    <!-- Overlay для закрытия панели -->
    <div v-if="isOpen" class="notifications-overlay" @click="closeNotifications"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  action?: {
    type: 'navigate' | 'open_chat'
    payload: any
  }
}

// Простой счетчик уведомлений
const unreadTotal = ref(0)

const isOpen = ref(false)
const notifications = ref<Notification[]>([])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Переключение панели уведомлений
const toggleNotifications = () => {
  isOpen.value = !isOpen.value
}

// Закрытие панели
const closeNotifications = () => {
  isOpen.value = false
}

// Отметить все как прочитанные
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

// Обработка клика по уведомлению
const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    notification.read = true
  }
  
  if (notification.action) {
    switch (notification.action.type) {
      case 'navigate':
        // TODO: навигация к странице
        console.log('Navigate to:', notification.action.payload)
        break
      case 'open_chat':
        // TODO: открыть чат
        console.log('Open chat:', notification.action.payload)
        break
    }
  }
  
  closeNotifications()
}

// Форматирование времени
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // меньше минуты
    return 'только что'
  } else if (diff < 3600000) { // меньше часа
    const minutes = Math.floor(diff / 60000)
    return `${minutes} мин. назад`
  } else if (diff < 86400000) { // меньше дня
    const hours = Math.floor(diff / 3600000)
    return `${hours} ч. назад`
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Добавление уведомления
const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
  const newNotification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date(),
    ...notification
  }
  
  notifications.value.unshift(newNotification)
  
  // Ограничиваем количество уведомлений
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(0, 50)
  }
  
  // Автоматически закрываем панель через 5 секунд если она открыта
  if (isOpen.value) {
    setTimeout(() => {
      if (isOpen.value) {
        closeNotifications()
      }
    }, 5000)
  }
}

// Обработчики событий чата
const handleChatMessage = (event: CustomEvent) => {
  const message = event.detail
  
  // Добавляем уведомление только если чат не активен
  addNotification({
    title: 'Новое сообщение',
    message: `${message.username}: ${message.text}`,
    type: 'info',
    action: {
      type: 'open_chat',
      payload: { roomId: 'general' } // TODO: определить комнату
    }
  })
}

const handleChatError = (event: CustomEvent) => {
  addNotification({
    title: 'Ошибка чата',
    message: event.detail.message,
    type: 'error'
  })
}

// Обработчики системных событий
const handleDocumentStatusChanged = (event: CustomEvent) => {
  addNotification({
    title: 'Статус документа изменен',
    message: `Документ "${event.detail.title}" получил статус "${event.detail.status}"`,
    type: 'info',
    action: {
      type: 'navigate',
      payload: { path: `/documents/${event.detail.documentId}` }
    }
  })
}

const handleDocumentCommentAdded = (event: CustomEvent) => {
  addNotification({
    title: 'Новый комментарий',
    message: `Добавлен комментарий к документу "${event.detail.title}"`,
    type: 'info',
    action: {
      type: 'navigate',
      payload: { path: `/documents/${event.detail.documentId}` }
    }
  })
}

// Инициализация
onMounted(() => {
  // Подписываемся на события чата
  window.addEventListener('chat:message', handleChatMessage as EventListener)
  window.addEventListener('chat:error', handleChatError as EventListener)
  
  // Подписываемся на события документов
  window.addEventListener('document:status_changed', handleDocumentStatusChanged as EventListener)
  window.addEventListener('document:comment_added', handleDocumentCommentAdded as EventListener)
  
  // Закрытие по Escape
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeNotifications()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('chat:message', handleChatMessage as EventListener)
  window.removeEventListener('chat:error', handleChatError as EventListener)
  window.removeEventListener('document:status_changed', handleDocumentStatusChanged as EventListener)
  window.removeEventListener('document:comment_added', handleDocumentCommentAdded as EventListener)
})

// Экспортируем функцию для добавления уведомлений извне
defineExpose({
  addNotification
})
</script>

<style scoped>
.notifications-container {
  position: relative;
}

.bell-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
}

.bell-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.bell-btn.has-notifications {
  color: #3b82f6;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 8px;
  min-width: 16px;
  text-align: center;
  line-height: 1;
}

.notifications-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  max-height: 400px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 8px 8px 0 0;
}

.notifications-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.mark-all-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.mark-all-btn:hover {
  background: #eff6ff;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  color: #6b7280;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  color: #111827;
  font-size: 14px;
  margin-bottom: 2px;
}

.notification-message {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  color: #9ca3af;
  font-size: 11px;
}

.unread-indicator {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
}

.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}
</style>
