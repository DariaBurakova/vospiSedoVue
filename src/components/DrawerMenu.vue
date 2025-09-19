
<script setup lang="ts">
import {ref} from "vue";

let menuListDrawerOne:array=ref([
  {
    id:1,
    name:'Протоколы',
    path:'/main/inbox',
    class:'',
  },
  {
    id:2,
    name:'План-графики',
    path:'/main/outgoing',
    class:'',
  },
])
let menuListDrawerTwo:array=ref([
  {
    id:1,
    name:'Договора закупок',
    path:'/main/inbox',
    class:'',
  },
  {
    id:2,
    name:'Список изделий',
    path:'/main/outgoing',
    class:'',
  },
  {
    id:3,
    name:'Журнал поездок',
    path:'/main/outgoing',
    class:'',
  },
])
let menuListDrawerThree:array=ref([
  {
    id:1,
    name:'Журнал брака',
    path:'/main/inbox',
    class:'',
  },
  {
    id:2,
    name:'Журнал производства',
    path:'/main/outgoing',
    class:'',
  },
  {
    id:3,
    name:'Журнал тестирования',
    path:'/main/outgoing',
    class:'',
  },
  {
    id:4,
    name:'Пропуска',
    path:'/main/outgoing',
    class:'',
  }
])
let menuListDrawerFour:array=ref([
  {
    id:1,
    name:'Документация',
    path:'/main/inbox',
    class:'',
  },
  {
    id:2,
    name:'Имущество',
    path:'/main/outgoing',
    class:'',
  },
])
</script>
<template>
  <div>
    <div  class="drawer-menu" >
      <div data-side="bottom" data-align="center" role="menu" aria-orientation="vertical" data-state="open" class="z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" tabindex="-1"  style="">
        <div v-for="itemOne in menuListDrawerOne" :key="itemOne.id" role="menuitem" class="drawer-menu-in  select-none rounded-sm px-2 py-1.5 text-sm    data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemOne.name}}</div>
        <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
        <div  v-for="itemTwo in menuListDrawerTwo" :key="itemTwo.id" role="menuitem" class="drawer-menu-in  select-none  rounded-sm px-2 py-1.5 text-sm  data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemTwo.name}}</div>
        <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
        <div v-for="itemThree in menuListDrawerThree" :key="itemThree.id" role="menuitem" class="drawer-menu-in  rounded-sm px-2 py-1.5 text-sm outline-none  data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemThree.name}}</div>
        <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
        <div v-for="itemFour in menuListDrawerFour" :key="itemFour.id"role="menuitem" class="drawer-menu-in  rounded-sm px-2 py-1.5 text-sm  data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 dark:focus:bg-slate-800 dark:focus:text-slate-50" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">{{itemFour.name}}</div>
        <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.drawer-menu{
  position: absolute;
  left: 0px;
  top: 0px;
  transform: translate(571.5px, 54px);
  min-width: max-content;
  will-change: transform;
  z-index: 50;
  --radix-popper-available-width: 1640px;
  --radix-popper-available-height: 342px;
  --radix-popper-anchor-width: 48.1015625px;
  --radix-popper-anchor-height: 50px;
  --radix-popper-transform-origin: 50% 0px;
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

</style>
