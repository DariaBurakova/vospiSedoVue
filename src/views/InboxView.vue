<script setup lang="ts">
import HeaderTable from "@/components/HeaderTable.vue";
import router from "@/router";
import TableBlock from "@/components/TableBlock.vue";
import { ref } from 'vue';

const routerName = String(router.currentRoute.value.name)
const tableBlockRef = ref()

const handleDocumentCreated = () => {
  // Перезагружаем список документов в TableBlock
  if (tableBlockRef.value && tableBlockRef.value.loadDocuments) {
    tableBlockRef.value.loadDocuments()
  }
}

const handleOpenChat = (roomId: string) => {
  // Эмитим событие наверх для открытия чата
  window.dispatchEvent(new CustomEvent('app:open-chat', { detail: { roomId } }))
}

</script>

<template>
  <div>
    <header-table :title="routerName" @document-created="handleDocumentCreated"/>
    <table-block ref="tableBlockRef" @open-chat="handleOpenChat"/>

<!--    <table class="table-auto w-full mt-30">-->
<!--      <thead>-->
<!--        <tr>-->
<!--          <th class="px-4 py-2">Дата</th>-->
<!--          <th class="px-4 py-2">История</th>-->
<!--          <th class="px-4 py-2">Организация(отправитель)</th>-->
<!--          <th class="px-4 py-2">Подписал</th>-->
<!--          <th class="px-4 py-2">Должность</th>-->
<!--          <th class="px-4 py-2">Содержание</th>-->
<!--          <th class="px-4 py-2">Доставка</th>-->
<!--          <th class="px-4 py-2">Исполнить до</th>-->
<!--          <th class="px-4 py-2">Вх</th>-->
<!--          <th class="px-4 py-2">Дата вх.</th>-->
<!--          <th class="px-4 py-2">Исполнение</th>-->
<!--          <th class="px-4 py-2">Заметки</th>-->
<!--          <th class="px-4 py-2">Файлы</th>-->
<!--        </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--        &lt;!&ndash; Здесь будет ваш код для заполнения таблицы данными &ndash;&gt;-->
<!--      </tbody>-->
<!--    </table>-->
  </div>
</template>


