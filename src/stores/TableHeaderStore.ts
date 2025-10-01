import {defineStore} from 'pinia';
export const useTableHeaderStore =defineStore('tableHeader',{
  state:()=>({
   headerColumns:[
     {
       title: 'Исх.номер отправителя',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Дата',
       input: false,
       icon:true,
       path: 'M12.3333 1.66602V4.99935M5.66667 1.66602V4.99935M1.5 8.33268H16.5M5.66667 11.666H5.675M9 11.666H9.00833M12.3333 11.666H12.3417M5.66667 14.9993H5.675M9 14.9993H9.00833M12.3333 14.9993H12.3417M3.16667 3.33268H14.8333C15.7538 3.33268 16.5 4.07887 16.5 4.99935V16.666C16.5 17.5865 15.7538 18.3327 14.8333 18.3327H3.16667C2.24619 18.3327 1.5 17.5865 1.5 16.666V4.99935C1.5 4.07887 2.24619 3.33268 3.16667 3.33268Z',
       button: true,
     },
     {
       title: 'История',
       input: true,
       icon:true,
       button: true
     },
     {
       title: 'Организация (отправитель)',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Подписал',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Должность',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Содержание',
       input: true,
       icon:true,
       button:false,

     },
     {
       title: 'Доставка',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Исполнить до',
       input: false,
       icon:true,
       button: true,
     },
     {
       title: 'Вх. №',
       input: true,
       icon:true,
       button: false,
     },
     {
       title: 'Дата вх.',
       input: false,
       icon:true,
       button:true,
     },
     {
       title: 'Исполнение',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Заметки',
       input: true,
       icon:true,
       button:false,
     },
     {
       title: 'Файлы',
       input: true,
       icon:true,
       button:false,
     }
   ] ,
    showCalendar:false,
    selectDateNow:{
      show:false,
      date:null
    },
    selectDateHistory:{
      show:false,
      date:null
    },
    selectDateIn:{
     show:false,
     date:null
    },
    selectDateBefore:{
      show:false,
      date:null
    },
  }),
  actions:{
    changeShowCalendar(objItem: any): any {
      objItem.show=!objItem.show
    }
  }
})
