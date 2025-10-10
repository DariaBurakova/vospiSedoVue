<script setup>
import TableBody from "@/components/TableBody.vue";
import { ref, onMounted } from 'vue';
import { listDocuments, createDocument, updateDocument, deleteDocument } from '@/api/documents';
import { useToast } from '@/composables/useToast';
import { useHotkeys, commonHotkeys } from '@/composables/useHotkeys';
import { useTablePreferences as usePrefsFull } from '@/composables/useTablePreferences'
import ColumnsPreferencesModal from '@/components/ColumnsPreferencesModal.vue'

const emit = defineEmits(['open-chat'])

const { success, error: showError } = useToast();

const columnsData = ref([]);
const filteredData = ref([]);
const loading = ref(false);
const error = ref('');
const showColumnsPrefs = ref(false)
const { visibleColumns, load: loadPrefs, order, widths } = usePrefsFull()

const openPreferences = () => { showColumnsPrefs.value = true }
const reloadAfterPrefs = () => {
  loadPrefs()
}

const openChat = (room) => { 
  emit('open-chat', room);
}

const searchFilters = ref({
  senderNumber: '',      // Исх.номер отправителя
  date: '',              // Дата
  history: '',           // История
  organization: '',      // Организация (отправитель)
  signer: '',            // Подписал
  position: '',          // Должность
  content: '',           // Содержание
  delivery: '',          // Доставка
  executeUntil: '',      // Исполнить до
  incomingNumber: '',    // Вх. №
  incomingDate: '',      // Дата вх.
  execution: '',         // Исполнение
  notes: '',             // Заметки
  files: ''              // Файлы
});

// Функция фильтрации данных
const filterData = () => {
  filteredData.value = columnsData.value.filter(doc => {
    const matchesSenderNumber = !searchFilters.value.senderNumber || 
      doc.outnom.toLowerCase().includes(searchFilters.value.senderNumber.toLowerCase());

    const matchesDate = !searchFilters.value.date || 
      doc.outdate.includes(searchFilters.value.date);

    const matchesHistory = !searchFilters.value.history || 
      (doc.content && doc.content.toLowerCase().includes(searchFilters.value.history.toLowerCase()));

    const matchesOrganization = !searchFilters.value.organization || 
      (doc.org && doc.org.toLowerCase().includes(searchFilters.value.organization.toLowerCase()));

    const matchesSigner = !searchFilters.value.signer || 
      (doc.signer && doc.signer.toLowerCase().includes(searchFilters.value.signer.toLowerCase()));

    const matchesPosition = !searchFilters.value.position || 
      (doc.dolj && doc.dolj.toLowerCase().includes(searchFilters.value.position.toLowerCase()));

    const matchesContent = !searchFilters.value.content || 
      (doc.content && doc.content.toLowerCase().includes(searchFilters.value.content.toLowerCase()));

    const matchesDelivery = !searchFilters.value.delivery || 
      (doc.delivery && doc.delivery.toLowerCase().includes(searchFilters.value.delivery.toLowerCase()));

    const matchesExecuteUntil = !searchFilters.value.executeUntil || 
      (doc.till && doc.till.includes(searchFilters.value.executeUntil));

    const matchesIncomingNumber = !searchFilters.value.incomingNumber || 
      (doc.innom && doc.innom.toLowerCase().includes(searchFilters.value.incomingNumber.toLowerCase()));

    const matchesIncomingDate = !searchFilters.value.incomingDate || 
      (doc.indate && doc.indate.includes(searchFilters.value.incomingDate));

    const matchesExecution = !searchFilters.value.execution || 
      (doc.outType && doc.outType.toLowerCase().includes(searchFilters.value.execution.toLowerCase()));

    const matchesNotes = !searchFilters.value.notes || 
      (doc.notes && doc.notes.some(note => note.toLowerCase().includes(searchFilters.value.notes.toLowerCase())));

    const matchesFiles = !searchFilters.value.files || 
      (doc.upLt && doc.upLt.name && doc.upLt.name.toLowerCase().includes(searchFilters.value.files.toLowerCase()));

    return matchesSenderNumber && matchesDate && matchesHistory && matchesOrganization &&
           matchesSigner && matchesPosition && matchesContent && matchesDelivery &&
           matchesExecuteUntil && matchesIncomingNumber && matchesIncomingDate &&
           matchesExecution && matchesNotes && matchesFiles;
  });
};

// Обработка поиска
const handleSearch = (searchData) => {
  searchFilters.value[searchData.column] = searchData.value;
  filterData();
};

// Загрузка документов из API
const loadDocuments = async () => {
  try {
    loading.value = true;
    error.value = '';
    const docs = await listDocuments(50, 0);
    
    // Преобразуем API документы в формат для таблицы
    columnsData.value = docs.map(doc => ({
      id: doc.id,
      outnom: doc.title,
      outdate: new Date().toISOString().split('T')[0],
      delivery: "api@example.com",
      org: "API Organization",
      orgId: "1",
      postId: "1",
      signer: "API User",
      signerId: "1",
      dolj: "API Position",
      content: doc.meta || doc.title,
      outType: doc.type,
      innom: doc.id?.slice(-4) || "0000",
      indate: new Date().toISOString().split('T')[0],
      till: null,
      exequtor: [
        {
          id: "1",
          parentRowId: "0",
          userId_from: "1",
          nameF: "API User",
          userId_to: "1",
          name: "__API__",
          level: 0,
          kontrol: "0",
          coment: "",
          mainExequtor: "0",
          answerNeed: "2",
          answerNeed_e: "Для ознакомления",
          sogl: "1",
          sogl_e: "Согласована",
          till: null,
          prosr: null,
          ts: new Date().toISOString(),
          comentCount: "0"
        }
      ],
      files: {
        upLt: {
          href: `/api/documents/${doc.id}/file`,
          name: "Документ"
        }
      },
      sendTktUID: "",
      ackUID: "",
      ts: new Date().toISOString(),
      active: "1",
      mailChain: [],
      notes: []
    }));
    
    // Инициализируем фильтрованные данные
    filterData();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки документов';
    console.error('Error loading documents:', err);
  } finally {
    loading.value = false;
  }
};

// Создание нового документа
const createNewDocument = async (docData) => {
  try {
    const newDoc = await createDocument({
      type: docData.type || 'Документ',
      title: docData.title || 'Новый документ',
      meta: docData.meta || ''
    });
    await loadDocuments(); // Перезагружаем список
    success('Успех', 'Документ создан');
    return newDoc;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ошибка создания документа';
    showError('Ошибка', errorMessage);
    throw err;
  }
};

// Обновление документа
const updateDocumentData = async (id, docData) => {
  try {
    const updatedDoc = await updateDocument(id, docData);
    await loadDocuments(); // Перезагружаем список
    success('Успех', 'Документ обновлен');
    return updatedDoc;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления документа';
    showError('Ошибка', errorMessage);
    throw err;
  }
};

// Удаление документа
const removeDocument = async (id) => {
  try {
    await deleteDocument(id);
    await loadDocuments(); // Перезагружаем список
    success('Успех', 'Документ удален');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления документа';
    showError('Ошибка', errorMessage);
    throw err;
  }
};

// Горячие клавиши
const { register } = useHotkeys();

onMounted(() => {
  loadDocuments();
  loadPrefs();
  
  // Регистрируем горячие клавиши
  register(commonHotkeys.refresh(() => {
    loadDocuments();
  }));
  
  register(commonHotkeys.search(() => {
    // Фокус на поле поиска (если есть)
    const searchInput = document.querySelector('input[placeholder*="Поиск"]');
    if (searchInput) {
      searchInput.focus();
    }
  }));
});

// Обработчики событий от дочерних компонентов
const handleDocumentUpdated = (documentId) => {
  console.log('Document updated:', documentId);
  // Можно добавить уведомление или другую логику
};

const handleDocumentDeleted = (documentId) => {
  console.log('Document deleted:', documentId);
  // Перезагружаем список после удаления
  loadDocuments();
};

// Экспортируем функции для использования в дочерних компонентах
defineExpose({
  loadDocuments,
  createNewDocument,
  updateDocumentData,
  removeDocument,
  loading,
  error
});

import TableHeader from "@/components/TableHeader.vue";
</script>
<template>
  <div class=" fixed top-0 px-4 rounded-md overflow-auto w-full z-30 mt-35 overflow-table">
    <div class="rounded-md" style="background-color: #fbf5ec;">
      <!-- Состояние загрузки -->
      <div v-if="loading" class="flex justify-center items-center h-32">
        <div class="text-gray-500">Загрузка документов...</div>
      </div>
      
      <!-- Состояние ошибки -->
      <div v-else-if="error" class="flex justify-center items-center h-32">
        <div class="text-red-500">Ошибка: {{ error }}</div>
      </div>
      
      <!-- Таблица документов -->
      <table v-else class="border border-gray-200" style="background-color: #fff9f0;">
        <colgroup>
          <template v-for="colId in order" :key="colId">
            <col v-if="visibleColumns.has(colId)"
                 :style="widths[colId] ? `width:${widths[colId]}px;` : ''" />
          </template>
        </colgroup>
        <thead class="sticky-header">
          <table-header @search="handleSearch" @open-preferences="openPreferences" class=" "/>
        </thead>
        <tbody class="" >
          <tr class=" hover:bg-gray-50" v-for="(col, index) in filteredData" :key="index">
            <!-- Каждую колонку рендерим из TableBody, а видимость контролируем CSS/атрибутами -->
            <table-body
              :data="col"
              :visible-columns="visibleColumns"
              :order="order"
              @document-updated="handleDocumentUpdated"
              @document-deleted="handleDocumentDeleted"
              @open-chat="openChat"
            />
          </tr>
        </tbody>
      </table>
      
      <!-- Пустое состояние -->
      <div v-if="!loading && !error && filteredData.length === 0" class="flex justify-center items-center h-32">
        <div class="text-gray-500">
          {{ columnsData.length === 0 ? 'Документы не найдены' : 'Нет документов, соответствующих критериям поиска' }}
        </div>
      </div>
    </div>
  </div>

  <!-- Модалка настроек колонок -->
  <ColumnsPreferencesModal
    v-if="showColumnsPrefs"
    @close="showColumnsPrefs = false"
    @saved="reloadAfterPrefs"
  />

</template>

<style>
.sticky-header {
  position: sticky !important;
  top: 0;
  background-color: white;
  z-index: 80;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transform: translateY(0px);
}
.table-fixed-head {
  width: 100%;
  table-layout: fixed;
  height: 100vh;
}
</style>

