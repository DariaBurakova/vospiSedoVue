import { defineStore } from 'pinia';
import { ref } from "vue";

interface FilterItem {
  id: number;
  check: boolean;
  name: string;
}

export const useFilterHeaderStore = defineStore('filterHeader', {
  state: () => ({
    showModalFilterControl: false,
    showModalFilterTask: false,
    showModalFilterStage: false,
    showModalSetting:false,
    filterButtonOne: [
      {
        id: 1,
        check: false,
        name: 'Расписано'
      },
      {
        id: 2,
        check: false,
        name: 'Не расписано'
      }
    ],
    filterButtonTwo: [
      {
        id: 1,
        check: false,
        name: 'Все'
      },
      {
        id: 2,
        check: false,
        name: 'По моему отделу'
      }
    ],
    filterControl: ' Все',
    filterTask: ' Все',
    filterStage: ' 365 дней',
    filterSelectTasks: [
      {
        id: 1,
        check: false,
        name: ' Все'
      },
      {
        id: 2,
        check: false,
        name: ' Для ответа'
      },
      {
        id: 3,
        check: false,
        name: ' Для ознакомления'
      },
      {
        id: 4,
        check: false,
        name: ' Для выполнения'
      }
    ],
    filterSelectStage: [
      {
        id: 1,
        check: false,
        name: ' 365 дней'
      },
      {
        id: 2,
        check: false,
        name: ' 180 дней'
      },
      {
        id: 3,
        check: false,
        name: ' 90 дней'
      },
      {
        id: 4,
        check: false,
        name: ' Указать период'
      }
    ],
    filterSelectControl: [
      {
        id: 1,
        check: false,
        name: ' Все'
      },
      {
        id: 2,
        check: false,
        name: ' На контроле'
      },
      {
        id: 3,
        check: false,
        name: ' Снятые с контроля'
      },
      {
        id: 4,
        check: false,
        name: ' Могу снимать с контроля'
      },
    ]
  }),
  actions: {
    changeShowModalSetting(){
      this.showModalSetting=!this.showModalSetting
    },
    handlerSelectButtonShowFilter(item: string) {
      this.showModalFilterControl = item === 'контроль' && !this.showModalFilterControl;
      this.showModalFilterTask = item === 'задачи' && !this.showModalFilterTask;
      this.showModalFilterStage = item === 'период' && !this.showModalFilterStage;
    },
    handlerCheckedFilter(title: string, name: string, id: number) {
      const filterList = title === 'контроль' ? this.filterSelectControl : title === 'задачи' ? this.filterSelectTasks : this.filterSelectStage;
      filterList.find((itemId) => {
        itemId.check = itemId.id === id;
      });
      if (title === 'контроль') {
        this.filterControl = name;
      } else if (title === 'задачи') {
        this.filterTask = name;
      } else {
        this.filterStage = name;
      }
    },
    changeCheckButtonOne(id: number, num: number) {
      const filterList = num === 1 ? this.filterButtonOne : this.filterButtonTwo;
      filterList.find((itemId) => {
        itemId.check = itemId.id === id;
      });
    }
  }
});


// import {defineStore} from 'pinia';
// import {ref} from "vue";
//
// export const useFilterHeaderStore=defineStore('filterHeader',{
//   state:()=>({
//     showModalFilterControl:false,
//     showModalFilterTask:false,
//     showModalFilterStage:false,
//    filterButtonOne:[
//       {
//         id:1,
//         check:false,
//         name:'Расписано'
//       },
//       {
//         id:2,
//         check:false,
//         name:'Не расписано'
//       }],
//    filterButtonTwo:[
//       {
//         id:1,
//         check:false,
//         name:'Все'
//       },
//       {
//         id:2,
//         check:false,
//         name:'По моему отделу'
//       }],
//     filterControl:' Все',
//     filterTask:' Все',
//     filterStage:' 365 дней',
//      filterSelectTasks:[
//       {
//         id:1,
//         check:false,
//         name:' Все'
//       },
//       {
//         id:2,
//         check:false,
//         name:' Для ответа'
//       },
//       {
//         id:3,
//         check:false,
//         name:' Для ознакомления'
//       },
//       {
//         id:4,
//         check:false,
//         name:' Для выполнения'
//       }],
//     filterSelectStage:[
//       {
//         id:1,
//         check:false,
//         name:' 365 дней'
//       },
//       {
//         id:2,
//         check:false,
//         name:' 180 дней'
//       },
//       {
//         id:3,
//         check:false,
//         name:' 90 дней'
//       },
//       {
//         id:4,
//         check:false,
//         name:' Указать период'
//       }],
//     filterSelectControl:[
//       {
//         id:1,
//         check:false,
//         name:' Все'
//       },
//       {
//         id:2,
//         check:false,
//         name:' На контроле'
//       },
//       {
//         id:3,
//         check:false,
//         name:' Снятые с контроля'
//       },
//       {
//         id:4,
//         check:false,
//         name:' Могу снимать с контроля'
//       },
//     ]
//   }),
//   actions:{
//     handlerSelectButtonShowFilter(item:string){
//       if(item==='контроль'){
//       if(this.showModalFilterControl!=true){
//         this.showModalFilterControl=true
//         this.showModalFilterTask=false
//         this.showModalFilterStage=false
//
//       }else{
//         this.showModalFilterControl=false
//       }
//     }
//     if(item==='задачи'){
//   if(this.showModalFilterTask!=true){
//     this.showModalFilterTask=true
//     this.showModalFilterStage=false
//     this.showModalFilterControl=false
//   }else{
//     this.showModalFilterTask=false
//   }
// }
// if(item==='период'){
//   if(this.showModalFilterStage!=true){
//     this.showModalFilterStage=true
//     this.showModalFilterControl=false
//     this.showModalFilterTask=false
//   }else{
//     this.showModalFilterStage=false
//   }
// }
// },
// handlerCheckedFilter(title:string,name:string,id:number){
//   if(title==='контроль'){
//     this.filterSelectControl.find((itemId)=>{
//       itemId.check=false
//       if(itemId.id===id){
//         itemId.check=true
//       }
//     })
//     this.filterControl=name
//   }
//   if(title==='задачи'){
//     this.filterSelectTasks.find((itemId)=>{
//       itemId.check=false
//       if(itemId.id===id){
//         itemId.check=true
//       }
//     })
//     this.filterTask=name
//   }
//   if(title==='период'){
//     this.filterSelectStage.find((itemId)=>{
//       itemId.check=false
//       if(itemId.id===id){
//         itemId.check=true
//       }
//     })
//     this.filterStage=name
//   }
// },
// changeCheckButtonOne(id:number,num:number) {
//   if(num===1){
//     this.filterButtonOne.find((itemId)=>{
//       if(itemId.id===id){
//         itemId.check=true
//       }else{
//         itemId.check=false
//       }
//     })
//   }
//   if(num===2){
//     this.filterButtonTwo.find((itemId)=>{
//       if(itemId.id===id){
//         itemId.check=true
//       }else{
//         itemId.check=false
//       }
//     })
//   }
//
// }
// }
// })
//
