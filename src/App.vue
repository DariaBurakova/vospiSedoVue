<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ToastContainer from '@/components/ToastContainer.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isChatOpen = ref(false)
const chatRoomId = ref<string | undefined>()

const openChat = (roomId?: string) => {
  chatRoomId.value = roomId
  isChatOpen.value = true
}

const closeChat = () => {
  isChatOpen.value = false
  chatRoomId.value = undefined
}

// Обработчик события открытия чата
const handleOpenChat = (event: CustomEvent) => {
  openChat(event.detail.roomId)
}

onMounted(() => {
  window.addEventListener('app:open-chat', handleOpenChat as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('app:open-chat', handleOpenChat as EventListener)
})
</script>

<template>
    <div class="app-container">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" @open-chat="openChat" />
        </transition>
      </router-view>
      
      <!-- Глобальные компоненты -->
      <div class="global-components">
        <!-- Чат -->
        <div v-if="isChatOpen" class="chat-overlay">
          <ChatWidget 
            :room-id="chatRoomId"
            @close="closeChat" 
          />
        </div>
      </div>
      
      <!-- Toast уведомления -->
      <ToastContainer />
    </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
}

.global-components {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
