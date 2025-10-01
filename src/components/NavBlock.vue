<script setup lang="ts">
import {useNavStore} from "@/stores/NavStore.ts";
import router from "@/router";
import {RouterView} from "vue-router";
import Loader from "@/components/Loader.vue";

const navStore=useNavStore();

function handlerChangeRouterAndClass(path:string,id:number){
  navStore.changeActiveClass(id)
  router.push({path:path})
}
function action(){
  navStore.handlerFetchMenuList()
}

function handleLogout() {
  localStorage.removeItem('access_token');
  router.push('/');
}

action()
</script>
<template>
  <nav class="navigation w-full bg-white px-4 border-b border-[#DFE7F2] z-50">
<div class="flex justify-between items-center bg-white gap-10">
<div class="nav-left flex gap-4">
  <div class="tab-item py-3 text-[#64748B] flex items-center gap-3 " v-for="item in navStore.menuList" :class="[item.class]" :key="item.id">
    <p @click="handlerChangeRouterAndClass(item.path,item.id)">{{item.name}}</p>
    <p v-if="item.unread && item.read  !== null" class="py-[2px] px-[6px] font-medium text-sm rounded-full flex justify-center items-center bg-[#f1f5f9]">
      <span  class="text-red-500">{{item.unread}}</span>
      <span class="">/{{item.read}}</span>
    </p>
  </div>
  <button  type="button" class="flex items-center gap-2" @click="navStore.changeShowMenu()">Еще
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4.5L4 1.5L1 4.5" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </button>
  <div  class="drawer-menu" v-show="navStore.showMenu" >
    <div data-side="bottom" data-align="center" role="menu" aria-orientation="vertical" data-state="open" class=" min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 " >
      <div v-for="itemOne in navStore.menuListDrawerOne" :key="itemOne.id" role="menuitem" class="drawer-menu-in  select-none rounded-sm px-2 py-1.5 text-sm    data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemOne.name}}</div>
      <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
      <div  v-for="itemTwo in navStore.menuListDrawerTwo" :key="itemTwo.id" role="menuitem" class="drawer-menu-in  select-none  rounded-sm px-2 py-1.5 text-sm  data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemTwo.name}}</div>
      <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
      <div v-for="itemThree in navStore.menuListDrawerThree" :key="itemThree.id" role="menuitem" class="drawer-menu-in  rounded-sm px-2 py-1.5 text-sm outline-none  data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemThree.name}}</div>
      <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
      <div v-for="itemFour in navStore.menuListDrawerFour" :key="itemFour.id"role="menuitem" class="drawer-menu-in  rounded-sm px-2 py-1.5 text-sm  data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemFour.name}}</div>
      <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
    </div>
  </div>
</div>
  <div class="nav-right flex items-center gap-6">
    <button data-accent-color class="rt-reset rt-BaseButton rt-r-size-2 rt-variant-solid rt-Button transparent flex items-center gap-2">
      <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 5.00065V4.00065C13 3.64703 12.8595 3.30789 12.6095 3.05784C12.3594 2.80779 12.0203 2.66732 11.6667 2.66732H2.33333C1.97971 2.66732 1.64057 2.80779 1.39052 3.05784C1.14048 3.30789 1 3.64703 1 4.00065V13.334C1 13.6876 1.14048 14.0267 1.39052 14.2768C1.64057 14.5268 1.97971 14.6673 2.33333 14.6673H4.66667M9.66667 1.33398V4.00065M4.33333 1.33398V4.00065M1 6.66732H4.33333M10.6667 11.6673L9.66667 10.834V9.33398M13.6667 10.6673C13.6667 11.7282 13.2452 12.7456 12.4951 13.4957C11.7449 14.2459 10.7275 14.6673 9.66667 14.6673C8.6058 14.6673 7.58839 14.2459 6.83824 13.4957C6.08809 12.7456 5.66667 11.7282 5.66667 10.6673C5.66667 9.60645 6.08809 8.58904 6.83824 7.83889C7.58839 7.08875 8.6058 6.66732 9.66667 6.66732C10.7275 6.66732 11.7449 7.08875 12.4951 7.83889C13.2452 8.58904 13.6667 9.60645 13.6667 10.6673Z"
              stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <u class="text-sm">Получить статистику</u>
    </button>
    <button type="button" role="combobox" class="button-access" @click="navStore.changeShowMenuAccess()">
      <span class="pe-1">Доступ:</span>
      <span style="pointer-events: none;">{{navStore.checkedAccess}}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 min-w-4 opacity-50" aria-hidden="true">
        <path d="m6 9 6 6 6-6"></path></svg>
      <div v-show="navStore.showMenuAccess"  class="access-menu rounded-md transition-colors shadow-sm  min-w-4 ">
<div v-for="itemAccess in navStore.menuAccess" :key="itemAccess.id" class="access-menu-list p-1" @click="navStore.handlerChangeAccessMenu(itemAccess.id)">
  <div>{{itemAccess.name}}</div>
  <div :class="itemAccess.checked?'control-selected':'control-selected-hidden'" class="">&#10003;</div></div>
      </div>
    </button>
    <button type="button" id="radix-:r8:" aria-haspopup="menu" aria-expanded="false" data-state="closed" @click="navStore.changeShowMenuUser()">
      <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <span class="flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">АП</span>
      </span>
      <div style="position: absolute;right: 10px;top:50px"><div v-show="navStore.showMenuUser" class="user-block" tabindex="-1"  style="outline: none;">
        <div role="menuitem" class="user-block-menuitem" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3664_16120)">
              <path d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 10.6667V8" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 5.33301H8.00667" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_3664_16120">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Инструкция пользователя</div>
        <div role="menuitem" class="user-block-menuitem" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.666 5.33301L10.666 7.99967L14.666 10.6663V5.33301Z" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M9.33398 4H2.66732C1.93094 4 1.33398 4.59695 1.33398 5.33333V10.6667C1.33398 11.403 1.93094 12 2.66732 12H9.33398C10.0704 12 10.6673 11.403 10.6673 10.6667V5.33333C10.6673 4.59695 10.0704 4 9.33398 4Z" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            </path>
          </svg>
          Видео инструкция</div>
        <div role="menuitem" class="user-block-menuitem" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3327 12.9997V13.333C13.3327 13.6866 13.1922 14.0258 12.9422 14.2758C12.6921 14.5259 12.353 14.6663 11.9993 14.6663H3.99935C3.64573 14.6663 3.30659 14.5259 3.05654 14.2758C2.80649 14.0258 2.66602 13.6866 2.66602 13.333V2.66634C2.66602 2.31272 2.80649 1.97358 3.05654 1.72353C3.30659 1.47348 3.64573 1.33301 3.99935 1.33301H9.66602L11.9993 3.66634" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.33398 12H6.00065" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M12.2793 6.40714C12.4094 6.27713 12.5637 6.174 12.7336 6.10364C12.9034 6.03328 13.0855 5.99707 13.2693 5.99707C13.4532 5.99707 13.6353 6.03328 13.8051 6.10364C13.975 6.174 14.1293 6.27713 14.2593 6.40714C14.3894 6.53715 14.4925 6.69149 14.5628 6.86136C14.6332 7.03122 14.6694 7.21328 14.6694 7.39714C14.6694 7.581 14.6332 7.76306 14.5628 7.93293C14.4925 8.10279 14.3894 8.25713 14.2593 8.38714L11.2993 11.3338L8.66602 12.0005L9.32602 9.36714L12.2793 6.40714Z" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          Шаблоны документов</div>
        <div role="menuitem" class="user-block-menuitem" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3327 13.9997V8.66634C13.3327 8.31272 13.1922 7.97358 12.9422 7.72353C12.6921 7.47348 12.353 7.33301 11.9993 7.33301H3.99935C3.64573 7.33301 3.30659 7.47348 3.05654 7.72353C2.80649 7.97358 2.66602 8.31272 2.66602 8.66634V13.9997" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.66602 10.6667C2.66602 10.6667 2.99935 10 3.99935 10C4.99935 10 5.66602 11.3333 6.66602 11.3333C7.66602 11.3333 8.33268 10 9.33268 10C10.3327 10 10.9993 11.3333 11.9993 11.3333C12.9993 11.3333 13.3327 10.6667 13.3327 10.6667" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M1.33398 14H14.6673" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.66602 5.33301V6.66634" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M8 5.33301V6.66634" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.334 5.33301V6.66634" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M4.66602 2.66699H4.67268" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 2.66699H8.00667" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M11.334 2.66699H11.3407" stroke="#965EDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          Дни рождения <span class="text-red-600">(3)</span></div>
        <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
        <div role="menuitem" class="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="" @click="handleLogout">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10.666 11.3337L13.9993 8.00033L10.666 4.66699" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M14 8H6" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          Выход</div>
      </div></div>

    </button>

  </div>
</div>
  </nav>
  <main style="margin: 54px auto;z-index: 0 !important; " >
    <Loader style="" v-if="navStore.loader"/>
    <RouterView />
  </main>


</template>
<style >
.button-access{
  display: flex;
  gap: 1px;
  height: 10px;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-placeholder-opacity: 1;
  cursor: not-allowed;
  --tw-line-clamp: 1;
  --tw-border-opacity: 1;
  border-color: rgba(31, 41, 55, var(--tw-border-opacity));
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #1f2937;
  --tw-placeholder-opacity: 1;
  width: 180px;
  border: none;
  padding: 0;
}
.access-menu{
  position: absolute;
  right: 5%;
  top: 54px;
  min-width: max-content;
  will-change: transform;
  z-index: 100;
  opacity: 1;
  cursor: pointer;
  background-color: #fff;
}
.access-menu-list{
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: relative;
  cursor: default;
  align-items: center;
  gap: 2px;
  outline: none;
  transition: color;
}
.access-menu-list div{
  display: flex;
  align-items: start;
  padding: 0.3rem;
}
.drawer-menu{
  position: absolute;
  left: 0px;
  top: 0px;
  transform: translate(571.5px, 54px);
  min-width: max-content;
  will-change: transform;
  z-index: 100;
  opacity: 1;
}
.drawer-menu-in{
  display: flex;
  position: relative;
  cursor: default;
  align-items: center;
  gap: 2px;
  outline: none;
  transition: color;
}

.drawer-menu-in:focus{
  --tw-bg-opacity: 1;
  background-color: rgb(241 245 249 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(15 23 42 / var(--tw-text-opacity));
}

   .user-block {
     position: relative;
     z-index: 50;
     min-width: 8rem;
     overflow: hidden;
     border-radius: 0.375rem;
     border: 1px solid #cbd5e1; /* slate-200 */
     background-color: #fff; /* white */
     padding: 0.25rem; /* p-1 */
     color: #0f172a; /* text-slate-950 */
     box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
   }

/* Темная тема */
.dark .user-block {
  border-color: #374151; /* dark:border-slate-800 */
  background-color: #0f172a; /* dark:bg-slate-950 */
  color: #f8fafc; /* dark:text-slate-50 */
}

/* Анимации */
.user-block[data-state="open"] {
  animation: animate-in 0.2s ease;
}

.user-block[data-state="closed"] {
  animation: animate-out 0.2s ease;
}

.user-block[data-state="closed"] {
  animation-name: fade-out-0, zoom-out-95;
}

.user-block[data-state="open"] {
  animation-name: fade-in-0, zoom-in-95;
}


.user-block[data-side="bottom"] {
  animation-delay: 0.1s;
  animation-name: slide-in-from-top-2;
}

.user-block[data-side="left"] {
  animation-delay: 0.1s;
  animation-name: slide-in-from-right-2;
}

.user-block[data-side="right"] {
  animation-delay: 0.1s;
  animation-name: slide-in-from-left-2;
}

.user-block[data-side="top"] {
  animation-delay: 0.1s;
  animation-name: slide-in-from-bottom-2;
}
.user-block-menuitem{
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  gap: 0.5rem; /* 2 */
  border-radius: 0.25rem; /* rounded-sm */
  padding: 0.375rem 0.5rem; /* px-2 py-1.5 */
  font-size: 0.875rem; /* text-sm */
  outline: none;
  transition: color 0.2s ease, background-color 0.2s ease;
}

/* Состояние фокуса */
.user-block-menuitem:focus {
  background-color: #f1f5f9; /* focus:bg-slate-100 */
  color: #0f172a; /* focus:text-slate-900 */
}

/* Темная тема */
.dark .user-block-menuitem:focus {
  background-color: #1e293b; /* dark:focus:bg-slate-800 */
  color: #f8fafc; /* dark:focus:text-slate-50 */
}

/* Атрибут data-disabled */
.user-block-menuitem[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}

/* Стили для SVG внутри */
.user-block-menuitem > svg {
  width: 1rem; /* size-4 */
  height: 1rem;
  flex-shrink: 0; /* shrink-0 */
}

</style>
