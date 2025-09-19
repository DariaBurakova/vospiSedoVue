<script setup lang="ts">
import {ref} from "vue";
import {useFilterHeaderStore} from "@/stores/FilterHeaderStore.ts";
const props=defineProps({
  title:String,
})
const filterHeader=ref(useFilterHeaderStore())

</script>
<template>
<div >
  <div class="header  w-full flex items-center gap-4 p-4 border-b z-40 border-[#DFE7F2] ">
    <div class="flex items-center gap-4 ">
      <h1 class="title text-xl font-semibold text-slate-500">{{props.title}}</h1>
      <button class="transparent hover:bg-gray-100 rounded-full" style="width: 36px;height: 36px;"  >
          <img style="width: 36px;height: 36px; margin: 0 auto ;padding:0;cursor: pointer;" src="@/assets/icons/button-icon.png" alt="Обновить данные"/>
      </button>
    </div>
    <div  class="flex items-center justify-center gap-1 bg-[#F1F5F9] border border-[#DFE7F2] rounded-lg p-[3px]"  style="outline: none;">
      <button type="button" v-for="itemButton in filterHeader.filterButtonOne":key="itemButton.id" :class="itemButton.check?'button-toggle-group-check':''" data-state="off"  class="button-toggle-group  text-slate-500 min-w-9"  @click="filterHeader.changeCheckButtonOne(itemButton.id,1)" >{{itemButton.name}}</button>
    </div>
    <div  class="flex items-center justify-center gap-1 bg-[#F1F5F9] border border-[#DFE7F2] rounded-lg p-[3px]"  style="outline: none;">
      <button type="button" v-for="itemButton in filterHeader.filterButtonTwo":key="itemButton.id" :class="itemButton.check?'button-toggle-group-check':''" data-state="off"  class="button-toggle-group  text-slate-500 min-w-9"  @click="filterHeader.changeCheckButtonOne(itemButton.id,2)" >{{itemButton.name}}</button>
    </div>

    <button  class=" button-filter-control rounded-md  shadow-sm  w-[180px] " @click="filterHeader.handlerSelectButtonShowFilter('контроль')"><span style=" width:85%; overflow: hidden;">Контроль:{{filterHeader.filterControl}}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 min-w-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
          <div v-show="filterHeader.showModalFilterControl" id="control" class="rounded-md transition-colors shadow-sm  min-w-4 ">
            <div class=" px-3 control-container " v-for="item in filterHeader.filterSelectControl" :key="item.id" @click="filterHeader.handlerCheckedFilter('контроль',item.name,item.id)">
              <div>{{item.name}}</div>
              <div :class="item.check?'control-selected':'control-selected-hidden'" class="">&#10003;</div>
            </div>
          </div>
      </button>

    <button  class=" button-filter-control rounded-md  shadow-sm  w-[180px]" @click="filterHeader.handlerSelectButtonShowFilter('задачи')"><span style=" width:85%; overflow: hidden;">Задачи:{{filterHeader.filterTask}}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 min-w-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      <div v-show="filterHeader.showModalFilterTask" id="control" class="rounded-md transition-colors shadow-sm  min-w-4 ">
        <div class=" px-3 control-container " v-for="item in filterHeader.filterSelectTasks" :key="item.id" @click="filterHeader.handlerCheckedFilter('задачи',item.name,item.id)">
          <div>{{item.name}}</div>
          <div :class="item.check?'control-selected':'control-selected-hidden'" class="">&#10003;</div>
        </div>
      </div>
    </button>
    <button  class=" button-filter-control rounded-md  shadow-sm  w-[180px]" @click="filterHeader.handlerSelectButtonShowFilter('период')"><span style=" width:85%; overflow: hidden;">Период:{{filterHeader.filterStage}}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 min-w-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      <div v-show="filterHeader.showModalFilterStage" id="control" class="rounded-md transition-colors shadow-sm  min-w-4 ">
        <div class=" px-3 control-container " v-for="item in filterHeader.filterSelectStage" :key="item.id" @click="filterHeader.handlerCheckedFilter('период',item.name,item.id)">
          <div>{{item.name}}</div>
          <div :class="item.check?'control-selected':'control-selected-hidden'" class="">&#10003;</div>
        </div>
      </div>
    </button>
    <div class="flex ml-auto gap-2 absolute right-4">
      <button type="button" @click="filterHeader.changeShowModalSetting()" id="radix-:rsm:" aria-haspopup="menu" aria-expanded="false" data-state="closed" class="bg-[#E2E8F0] hover:bg-slate-300 duration-300 border border-slate-300 w-10 h-10 p-2 flex items-center justify-center rounded-md">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.334 4.66699H7.33398" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9.33398 11.333H3.33398" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M11.334 13.333C12.4386 13.333 13.334 12.4376 13.334 11.333C13.334 10.2284 12.4386 9.33301 11.334 9.33301C10.2294 9.33301 9.33398 10.2284 9.33398 11.333C9.33398 12.4376 10.2294 13.333 11.334 13.333Z" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M4.66602 6.66699C5.77059 6.66699 6.66602 5.77156 6.66602 4.66699C6.66602 3.56242 5.77059 2.66699 4.66602 2.66699C3.56145 2.66699 2.66602 3.56242 2.66602 4.66699C2.66602 5.77156 3.56145 6.66699 4.66602 6.66699Z" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
        <div v-show="filterHeader.showModalSetting" class="setting-menu " >
        <div class=" min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ">
          <div class="setting-menu-list  select-none rounded-sm px-2 py-1.5 text-sm    data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" >Настроить цвета колонок</div>
          <div class="setting-menu-list select-none rounded-sm px-2 py-1.5 text-sm    data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50">Закрепить колонки</div>
          <div class="setting-menu-list select-none rounded-sm px-2 py-1.5 text-sm    data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50">Что-то еще...</div>
        </div>
        </div>
    </button>
      <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 dark:focus-visible:ring-slate-300 bg-slate-800 text-slate-50 shadow hover:bg-[#31425A] duration-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 px-4 py-2 h-10" >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.00065 1.33398V10.6673M1.33398 6.00065H10.6673" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">

          </path>
      </svg>Создать
      </button>
    </div>
  </div>

</div>
</template>

<style >
.button-toggle-group{
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  height: 2rem/* 32px */;
  padding-left: 0.75rem/* 12px */;
  padding-right: 0.75rem/* 12px */;
  cursor: pointer;
}
.button-toggle-group-check{
  background-color: rgb(255 255 255);
  color:rgb(15 23 42);
}
.button-toggle-group:hover{
  color:rgb(15 23 42);
  opacity: 1;
}
.button-filter-control{
  display: flex;
  gap: 0.25rem;
  height: 2.5rem;
  text-wrap: none;
  position: relative;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap !important;
  border-width: 1px;
  border-color: rgb(226 232 240 );
  background-color: rgb(255 255 255 );
  padding-left: 0.75rem/* 12px */;
  padding-right: 0.75rem/* 12px */;
  font-size: 0.875rem/* 14px */;
  line-height: 1.25rem/* 20px */;
  cursor: pointer;
}
#control{
  position: absolute;
  top:50px;
  left:0px;
  height-min:20px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 0.5rem/* 8px */;
  font-size: 0.875rem/* 14px */;
  line-height: 1.25rem/* 20px */;
  font-weight: 400;
  padding: 0.75rem;
  white-space: nowrap;
  background-color: rgb(255 255 255);
  /*--tw-border-opacity: 1;*/
  border-color: rgb(226 232 240);
  cursor: pointer;
}
.control-container {
  width: 100%;
  display: flex;
  justify-content: space-between;

}
.control-container div{
  display: flex;
  align-items: start;
  padding: 0.3rem;
}
.control-selected-hidden{
  width: 12px;
  opacity: 0;
}
.control-selected{
  width: 12px;
  display: flex;
 justify-content: end;
}

.control-container:hover{
  cursor: pointer;
  background-color: rgb(241 245 249 );
  border-radius: 0.2rem;
}
.setting-menu{
  min-width: max-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  right: 5%;
  top: 54px;
  will-change: transform;
  opacity: 1;
  cursor: pointer;
  background-color: #fff;
  gap: 2px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.4rem;

}
.setting-menu-list{
  display: flex;
  align-items: flex-start;
  position: relative;
  cursor: default;
  outline: none;
  transition: color;
  padding: 5px 8px 2px 2px;
  margin: 4px 8px;
}
:root {
  --bg-opacity: 1;
}
.setting-menu-list:hover {
  background-color: rgba(241, 245, 249, var(--bg-opacity));
  border-radius: 0.2rem;
}

</style>
