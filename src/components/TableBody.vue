<script setup>
import { ref, computed } from 'vue';
import { updateDocument, deleteDocument } from '@/api/documents';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  visibleColumns: {
    type: Object,
    required: false,
    default: () => new Set()
  },
  order: {
    type: Array,
    required: false,
    default: () => []
  }
});

const emit = defineEmits(['document-updated', 'document-deleted', 'open-chat']);

const isNotesModalOpen = ref(false);
const currentNote = ref('');
const editingNoteIndex = ref(null);

const openAddNoteModal = (note = '', index = null) => {
  currentNote.value = note;
  editingNoteIndex.value = index;
  isNotesModalOpen.value = true;
};

const closeNotesModal = () => {
  isNotesModalOpen.value = false;
  currentNote.value = '';
  editingNoteIndex.value = null;
};

const saveNote = () => {
  if (currentNote.value.trim() === '') return;

  const newNote = {
    date: new Date().toISOString().split('T')[0],
    text: currentNote.value
  };

  if (editingNoteIndex.value !== null) {
    props.data.notes[editingNoteIndex.value] = newNote;
  } else {
    props.data.notes.push(newNote);
  }
  closeNotesModal();
};

const sortedNotes = computed(() => {
  return props.data.notes.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Редактирование документа
const editDocument = async (field, value) => {
  if (!props.data.id) return;
  
  try {
    const updateData = {};
    if (field === 'title') updateData.title = value;
    if (field === 'content') updateData.meta = value;
    if (field === 'type') updateData.type = value;
    
    await updateDocument(props.data.id, updateData);
    emit('document-updated', props.data.id);
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

// Удаление документа
const removeDocument = async () => {
  if (!props.data.id) return;
  
  if (confirm('Вы уверены, что хотите удалить этот документ?')) {
    try {
      await deleteDocument(props.data.id);
      emit('document-deleted', props.data.id);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }
};

const openChat = () => {
  const sn = (props.data?.outnom || '').toString().trim();
  if (!sn) return;
  const room = `topic:senderNumber:${sn}`;
  emit('open-chat', room);
};
</script>

<template>
  <template v-for="colId in (order && order.length ? order : ['chat','senderNumber','date','history','organization','signer','position','content','delivery','executeUntil','incomingNumber','incomingDate','execution','notes','files'])" :key="colId">
    <!-- chat -->
    <td v-if="colId==='chat' && visibleColumns.has('chat')" data-col="-1" class="col-td p-0" style="width:28px; min-width:28px; max-width:28px; padding:0;">
      <button
        :disabled="!(data?.outnom)"
        @click="openChat"
        class="inline-flex items-center justify-center rounded hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:opacity-40 p-0"
        style="width:28px; height:28px;"
        aria-label="Открыть чат по исходящему номеру"
        title="Открыть чат по исходящему номеру"
      >
        <img src="/src/assets/chat.jpg" alt="chat" class="block object-contain" style="width:20px; height:20px;" />
      </button>
    </td>

    <!-- senderNumber -->
    <td v-else-if="colId==='senderNumber' && visibleColumns.has('senderNumber')" data-col="0" class="col-td" >
      <span  class="w-full text-sm border-none bg-transparent focus:outline-none" >{{data.outnom}}</span>
    </td>

    <!-- date -->
    <td v-else-if="colId==='date' && visibleColumns.has('date')" data-col="1" class="col-td" >
      <button class="inline-flex items-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent hover:bg-gray-50 text-gray-700 h-9 w-[240px] justify-start text-left font-normal p-2" type="button">
        <span>{{ data.outdate }}</span>
      </button>
    </td>

    <!-- history -->
    <td v-else-if="colId==='history' && visibleColumns.has('history')" data-col="2" class="col-td" >
      <div  class="flex flex-col items-start gap-1">
        <span v-for="(link, i) in data.links" :key="i">
          <a v-if="link.id ===1" href="#" class="flex gap-1 items-center text-sm hover:text-blue-500">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.888638 9.10972C0.68035 8.9014 0.68035 8.5637 0.888638 8.35548L7.97818 1.26589H3.39909C3.10454 1.26589 2.86576 1.0271 2.86576 0.732552C2.86576 0.438003 3.10454 0.199219 3.39909 0.199219H9.26576C9.4072 0.199219 9.54288 0.255411 9.64293 0.355432C9.74288 0.455453 9.79909 0.591101 9.79909 0.732552V6.59923C9.79909 6.89378 9.56026 7.13256 9.26576 7.13256C8.97125 7.13256 8.73242 6.89378 8.73242 6.59923V2.02014L1.64288 9.10972C1.4346 9.31794 1.09692 9.31794 0.888638 9.10972Z" fill="#3E63DD"/>
            </svg>
            {{ link.link }}
          </a>
          <a v-if="link.id ===2" href="#" class="flex gap-1 items-center text-sm hover:text-blue-500">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.888638 0.888639C0.68035 1.09692 0.68035 1.4346 0.68035 1.64288L7.97818 8.73244H3.39909C3.10454 8.73244 2.86576 8.97126 2.86576 9.26577C2.86576 9.56028 3.10454 9.7991 3.39909 9.7991H9.26576C9.4072 9.7991 9.54288 9.74289 9.64293 9.64294C9.74288 9.54289 9.79909 9.40721 9.79909 9.26577V3.39909C9.79909 3.10454 9.56026 2.86576 9.26576 2.86576C8.97125 2.86576 8.73242 3.10454 8.73242 3.39909V7.9782Л1.64288 0.888629C1.4346 0.680351 1.09692 0.680351 0.888638 0.888639Z" fill="#DC7609"/>
            </svg>
            {{ link.link }}
          </a>
        </span>
        <button v-if="data.showMore" type="button" class="outline-none p-0">
          <div class="text-sm text-blue-500 hover:underline cursor-pointer">Показать (+4)</div>
        </button>
      </div>
    </td>

    <!-- organization -->
    <td v-else-if="colId==='organization' && visibleColumns.has('organization')" data-col="3" class="col-td" >
      <span class="w-full text-sm border-none bg-transparent focus:outline-none">{{data.org}}</span>
    </td>

    <!-- signer -->
    <td v-else-if="colId==='signer' && visibleColumns.has('signer')" data-col="4" class="col-td" >
      <span class="w-full text-sm border-none bg-transparent focus:outline-none">{{data.signer}}</span>
    </td>

    <!-- position -->
    <td v-else-if="colId==='position' && visibleColumns.has('position')" data-col="5" class="col-td" >
      <span class="w-full text-sm border-none bg-transparent focus:outline-none">{{data.dolj}}</span>
    </td>

    <!-- content -->
    <td v-else-if="colId==='content' && visibleColumns.has('content')" data-col="6" class="col-td" >
      <input type="text" class="w-full text-sm border-none bg-transparent focus:outline-none" :value="data.content" @blur="editDocument('content', $event.target.value)" />
    </td>

    <!-- delivery -->
    <td v-else-if="colId==='delivery' && visibleColumns.has('delivery')" data-col="7" class="col-td" >
      <input type="text" class="w-full text-sm border-none bg-transparent focus:outline-none" :value="data.delivery" />
    </td>

    <!-- executeUntil -->
    <td v-else-if="colId==='executeUntil' && visibleColumns.has('executeUntil')" data-col="8" class="col-td" >
      <button class="inline-flex items-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent hover:bg-gray-50 text-gray-700 h-9 w-[240px] justify-start text-left font-normal p-2" type="button">
        <span>{{ data.performerDate }}</span>
      </button>
    </td>

    <!-- incomingNumber -->
    <td v-else-if="colId==='incomingNumber' && visibleColumns.has('incomingNumber')" data-col="9" class="col-td" >
      <input type="text" class="w-full text-sm border-none bg-transparent focus:outline-none" :value="data.outnom" />
    </td>

    <!-- incomingDate -->
    <td v-else-if="colId==='incomingDate' && visibleColumns.has('incomingDate')" data-col="10" class="col-td" >
      <button class="inline-flex items-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent hover:bg-gray-50 text-gray-700 h-9 w-[240px] justify-start text-left font-normal p-2" type="button">
        <span>{{ data.indate }}</span>
      </button>
    </td>

    <!-- execution -->
    <td v-else-if="colId==='execution' && visibleColumns.has('execution')" data-col="11" class="col-td" >
      <div  class="flex flex-col gap-1 h-[70px]" v-for="item in data.exequtor">
        <div class="flex gap-1 items-center">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
          <span class="text-sm">{{ item.name }}</span>
          <button type="button" role="checkbox" :aria-checked="data.checked" :data-state="item.sogl == '1'? 'checked' : 'unchecked'" class="peer h-4 w-4 shrink-0 rounded-sm border border-slate-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50"></button>
        </div>
      </div>
    </td>

    <!-- notes -->
    <td v-else-if="colId==='notes' && visibleColumns.has('notes')" data-col="12" class="col-td">
      <div class="flex flex-col items-start">
        <button @click="openAddNoteModal()" class="text-blue-500 hover:underline mb-2 text-2xl">+</button>
        <div v-for="(note, index) in sortedNotes" :key="index" @click="openAddNoteModal(note.text, index)" class="cursor-pointer">
          <span class="font-bold">{{ note.date }}:</span> {{ note.text }}
        </div>
      </div>
    </td>

    <!-- files -->
    <td v-else-if="colId==='files' && visibleColumns.has('files')" data-col="13" class="col-td" >
      <a :href="data.files.upLt.href" class="text-blue-500 underline text-sm hover:text-[#1043EC]" target="_blank" rel="noopener">{{ data.files.upLt.href }}</a>
    </td>
  </template>

  <td data-col="13" class="col-td" >
   <div class="flex gap-2">
     <button @click="removeDocument" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-red-200 bg-white hover:bg-red-50 text-red-600 w-auto h-auto p-1">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4M6.667 7.333v4M9.333 7.333v4M2.667 4h10.666l-.8 9.333a1.333 1.333 0 0 1-1.333 1.2H4.8a1.333 1.333 0 0 1-1.333-1.2L2.667 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>
     </button>
     <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 w-auto h-auto p-1">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M7.99967 8.66732C8.36786 8.66732 8.66634 8.36884 8.66634 8.00065C8.66634 7.63246 8.36786 7.33398 7.99967 7.33398C7.63148 7.33398 7.33301 7.63246 7.33301 8.00065C7.33301 8.36884 7.63148 8.66732 7.99967 8.66732Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
         <path d="M7.99967 3.99935C8.36786 3.99935 8.66634 3.70087 8.66634 3.33268C8.66634 2.96449 8.36786 2.66602 7.99967 2.66602C7.63148 2.66602 7.33301 2.96449 7.33301 3.33268C7.33301 3.70087 7.63148 3.99935 7.99967 3.99935Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
         <path d="M7.99967 13.3333C8.36786 13.3333 8.66634 13.0349 8.66634 12.6667C8.66634 12.2985 8.36786 12 7.99967 12C7.63148 12 7.33301 12.2985 7.33301 12.6667C7.33301 13.0349 7.63148 13.3333 7.99967 13.3333Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>
     </button>
   </div>
  </td>

  <!-- Notes Modal -->
  <div v-if="isNotesModalOpen" class="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-center z-50">
          <div class="rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" style="background-color: #F8FAFC;">
      <div class="flex items-center justify-between px-6 py-4">
        <h2 class="text-xl font-semibold text-gray-900">{{ editingNoteIndex === null ? 'Добавить заметку' : 'Редактировать заметку' }}</h2>
        <button @click="closeNotesModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="px-6 pb-6 space-y-4">
        <div class="rounded-lg shadow-sm p-3" style="background-color: #FFFFFF; border: 1px solid #DFE7F2;">
          <label class="block text-sm font-medium text-gray-700 mb-2">Текст заметки</label>
          <textarea 
            v-model="currentNote" 
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            rows="10"
            placeholder="Введите текст заметки..."
          ></textarea>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button @click="closeNotesModal" type="button" class="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700">Отмена</button>
          <button @click="saveNote" type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors font-medium" style="background-color: #1E293B; color: white; height: 40px; padding: 0 12px; border-radius: 6px;">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.col-td {
         /* relative */
  border: 1px solid #e5e7eb;   /* border-gray-200 */
  background-color: #fff9f0;   /* bg custom */
  padding: 0.5rem;             /* p-2 */
  min-height: 84px;            /* min-h-[84px] */
  max-height: 84px;            /* max-h-[84px] */
  overflow: hidden;            /* overflow-hidden */
  transition: background-color 0.2s ease; /* плавная смена фона при ховере */
}

.col-td:hover {
  background-color: #f3f4f5;   /* hover:bg-[#F3F4F5] */
}

</style>
