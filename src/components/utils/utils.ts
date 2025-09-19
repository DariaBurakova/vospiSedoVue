export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
// <template>
//   <td data-col="0" class="col-td" >
// <!-- Текст -->
// <span  class="w-full text-sm border-none bg-transparent focus:outline-none" >{{data.numberDocument}}</span>
// </td>
// <td data-col="1" class="col-td" >
// <!-- Кнопка -->
// <button class="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-slate-300 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 w-[240px] justify-start text-left font-normal bg-transparent border-none shadow-none p-0 text-muted-foreground" type="button">
//   <span>{{ data.dateDocument }}</span>
// </button>
// </td>
// <!-- Ссылки -->
// <td data-col="2" class="col-td" >
// <div  class="flex flex-col items-start gap-1">
//   <span v-for="(link, i) in data.links"
//   :key="i">
//
//   <a v-if="link.id ===1"
//
//   href="#"
// class="flex gap-1 items-center text-sm hover:text-blue-500"
// >
// <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M0.888638 9.10972C0.68035 8.9014 0.68035 8.5637 0.888638 8.35548L7.97818 1.26589H3.39909C3.10454 1.26589 2.86576 1.0271 2.86576 0.732552C2.86576 0.438003 3.10454 0.199219 3.39909 0.199219H9.26576C9.4072 0.199219 9.54288 0.255411 9.64293 0.355432C9.74288 0.455453 9.79909 0.591101 9.79909 0.732552V6.59923C9.79909 6.89378 9.56026 7.13256 9.26576 7.13256C8.97125 7.13256 8.73242 6.89378 8.73242 6.59923V2.02014L1.64288 9.10972C1.4346 9.31794 1.09692 9.31794 0.888638 9.10972Z" fill="#3E63DD"/>
//   </svg>
// {{ link.link }}
// </a>
// <a v-if="link.id ===2"
//
//   href="#"
// class="flex gap-1 items-center text-sm hover:text-blue-500"
// >
// <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M0.888638 0.888639C0.68035 1.09692 0.68035 1.4346 0.888638 1.64288L7.97818 8.73244H3.39909C3.10454 8.73244 2.86576 8.97126 2.86576 9.26577C2.86576 9.56028 3.10454 9.7991 3.39909 9.7991H9.26576C9.4072 9.7991 9.54288 9.74289 9.64293 9.64294C9.74288 9.54289 9.79909 9.40721 9.79909 9.26577V3.39909C9.79909 3.10454 9.56026 2.86576 9.26576 2.86576C8.97125 2.86576 8.73242 3.10454 8.73242 3.39909V7.9782L1.64288 0.888629C1.4346 0.680351 1.09692 0.680351 0.888638 0.888639Z" fill="#DC7609"/>
//   </svg>
// {{ link.link }}
// </a>
// </span>
// <button v-if="data.showMore" type="button" class="outline-none p-0">
// <div class="text-sm text-blue-500 hover:underline cursor-pointer">Показать (+4)</div>
//   </button>
//   </div>
//   </td>
//   <td data-col="3" class="col-td" >
// <span class="w-full text-sm border-none bg-transparent focus:outline-none">{{data.nameCompany}}</span>
// </td>
// <td data-col="4" class="col-td" >
// <span class="w-full text-sm border-none bg-transparent focus:outline-none">{{data.nameResponsibility}}</span>
// </td>
// <td data-col="5" class="col-td" >
// <span class="w-full text-sm border-none bg-transparent focus:outline-none">{{data.namePosition}}</span>
// </td>
// <td data-col="6" class="col-td" >
// <input
//   type="text"
// class="w-full text-sm border-none bg-transparent focus:outline-none"
// :value="data.text"
//   />
//   </td>
//   <td data-col="7" class="col-td" >
// <input
//   type="text"
// class="w-full text-sm border-none bg-transparent focus:outline-none"
// :value="data.email"
//   />
//   </td>
//   <td data-col="8" class="col-td" >
// <button class="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-slate-300 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 w-[240px] justify-start text-left font-normal bg-transparent border-none shadow-none p-0 text-muted-foreground" type="button">
//   <span>{{ data.performerDate }}</span>
// </button>
// </td>
// <td data-col="9" class="col-td" >
// <input
//   type="text"
// class="w-full text-sm border-none bg-transparent focus:outline-none"
// :value="data.numberIn"
//   />
//   </td>
//   <td data-col="10" class="col-td" >
// <button class="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-slate-300 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 w-[240px] justify-start text-left font-normal bg-transparent border-none shadow-none p-0 text-muted-foreground" type="button">
//   <span>{{ data.dateIn }}</span>
// </button>
// </td>
// <!-- Чекбокс -->
// <td data-col="11" class="col-td" >
// <div  class="flex flex-col gap-1 h-[70px]">
// <div class="flex gap-1 items-center">
// <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <!-- SVG path -->
// </svg>
// <span class="text-sm">{{ data.label }}</span>
// <button
// type="button"
// role="checkbox"
// :aria-checked="data.checked"
// :data-state="data.checked ? 'checked' : 'unchecked'"
// class="peer h-4 w-4 shrink-0 rounded-sm border border-slate-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-50 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900"
// >
// <span data-state="checked" class="flex items-center justify-center text-current">
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-4 w-4">
// <path d="M20 6 9 17l-5-5"></path>
//   </svg>
//   </span>
//   </button>
//   </div>
//   <div class="flex gap-1 items-center">
// <div class="rows-counter px-3 relative text-sm">
// <span class="bg-white px-[5px] py-[2px]">{{ data.counter }}</span>
// </div>
// <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <!-- SVG path -->
// </svg>
// <span class="text-sm">{{ data.name }}</span>
// <button
// type="button"
// role="checkbox"
// :aria-checked="data.unchecked"
// data-state="unchecked"
// class="peer h-4 w-4 shrink-0 rounded-sm border border-slate-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-50 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900"
//   ></button>
//   <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <!-- SVG path -->
// </svg>
// </div>
// </div>
// </td>
// <!-- Текстовая область -->
// <td data-col="12" class="col-td" >
// <div class="hover-card relative border border-gray-200 bg-white hover:bg-[#F3F4F5] p-2 min-w-[300px] min-h-[84px] max-h-[84px] overflow-hidden">
//   <textarea
// :placeholder="data.placeholder"
// class="w-full text-sm border-none min-h-16 bg-transparent resize-none focus:outline-none"
// v-model="data.valueText"
//   >{{ data.valueText }}</textarea>
// </div>
// </td>
// <!-- Ссылка -->
// <td data-col="13" class="col-td" >
// <div  class="hover-card relative border border-gray-200 bg-white hover:bg-[#F3F4F5] p-2 min-w-[300px] min-h-[84px] max-h-[84px] overflow-hidden">
// <button class="text-blue-500 underline text-sm hover:text-[#1043EC]">
//   {{ data.letter }}
// </button>
// </div>
// </td>
// <td data-col="13" class="col-td" >
// <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-slate-300 border border-slate-200   dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 w-auto h-auto p-0 border-none bg-transparent">
// <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M7.99967 8.66732C8.36786 8.66732 8.66634 8.36884 8.66634 8.00065C8.66634 7.63246 8.36786 7.33398 7.99967 7.33398C7.63148 7.33398 7.33301 7.63246 7.33301 8.00065C7.33301 8.36884 7.63148 8.66732 7.99967 8.66732Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M7.99967 3.99935C8.36786 3.99935 8.66634 3.70087 8.66634 3.33268C8.66634 2.96449 8.36786 2.66602 7.99967 2.66602C7.63148 2.66602 7.33301 2.96449 7.33301 3.33268C7.33301 3.70087 7.63148 3.99935 7.99967 3.99935Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M7.99967 13.3333C8.36786 13.3333 8.66634 13.0349 8.66634 12.6667C8.66634 12.2985 8.36786 12 7.99967 12C7.63148 12 7.33301 12.2985 7.33301 12.6667C7.33301 13.0349 7.63148 13.3333 7.99967 13.3333Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   </svg>
//   </button>
//   </td>
//   </template>
// как будет осуществятся фильтрация документов если загружается они по страницам 
// const communicationData = [{
//   "user":[{
//     "id": "1",// id пользователя
//     "name": "",// ФИО пользователя
//     "login": "admin",// логин
//     "password": "123456",// пароль
   
//   }],
// "incomingMessages":[{ //входящие сообщения
// "settingsIncoming":[ // настройки входящих сообщений у каждого пользователя они свои,видны или нет колонки
//     { 
//       "idColumn": "1", // id колонки
//       "titleColumn": "Исх.номер отправителя", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "2", // id колонки
//       "titleColumn": "Дата", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "3", // id колонки
//       "titleColumn": "История", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "4", // id колонки
//       "titleColumn": "Организация (отправитель)", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "5", // id колонки
//       "titleColumn": "Подписал", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "6", // id колонки
//       "titleColumn": "Должность", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "7", // id колонки
//       "titleColumn": "Содержание", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//   { 
//       "idColumn": "8", // id колонки
//       "titleColumn": "Доставка", // название колонки
//       "visible": "1" // видна или нет колонка
//   },
//    { 
//       "idColumn": "9", // id колонки
//       "titleColumn": "Исполнить до", // название колонки
//       "visible": "1" // видна или нет колонка
//   }, { 
//       "idColumn": "10", // id колонки
//       "titleColumn": "Вх. №", // название колонки
//       "visible": "1" // видна или нет колонка
//   }, { 
//       "idColumn": "11", // id колонки
//       "titleColumn": "Дата вх.", // название колонки
//       "visible": "1" // видна или нет колонка
//   }, { 
//       "idColumn": "12", // id колонки
//       "titleColumn": "Исполнение", // название колонки
//       "visible": "1" // видна или нет колонка
//   }, { 
//       "idColumn": "13", // id колонки
//       "titleColumn": "Заметки", // название колонки
//       "visible": "1" // видна или нет колонка
//   },{ 
//       "idColumn": "14", // id колонки
//       "titleColumn": "Файлы", // название колонки
//       "visible": "1" // видна или нет колонка
//   }
// ],
//   "scheduled": "0",// для фильтра расписано/нерасписано
//   "myDepartmentFilter":"0",// для фильтра относится данное сообщение к моему отделу
//   "controlMessagesFilter":"0",// для фильтра контроля(все-0,на контроле-1,снятые с контроля-2,могу снимать с контроля-3)
//   "taskMessagesFilter":"0",// для фильтра задач(Все-0,для ответа-1,для ознакомления-2,для выполения-3)
//   "outnom": "23164/096-2025",// колонка Исх.номер отправителя
//   "outdate": "2025-09-02",// колонка Дата отправления
//   "historyMessages":[ // история документа
//     {
//       "id": 1,//входной номер красная стрелка
//       "dateIn": "2025-09-02 16:02:24",//дата вх
//       "idDocument":"12/348670",//входной номер
    
//     },
//      {
//       "id": 2,//исходяий номер синяя срелка
//       "dateIn": "2025-09-02 16:02:24",//дата исх
//       "idDocument":"12/348670",//исходящий номер
    
//     }
//   ],
//   "org": "АО «РПКБ»",// колонка Организация
//   "orgId": "151",// колонка Организация(id) 
//   "signer": "О.И.Брыляев",// колонка Подписал
//   "signerId": "12850",// колонка Подписал(id)
//   "dolj": "Директор по кооперации и МТО",// колонка Должность
//   "content": "Уточнение банковских реквизитов к дг.99-25/Ц 28.04.2025",// колонка Содержание
//   "delivery": "rpkb@rpkb.ru",// колонка Доставка
//   "outType": "Договор",//тип входящего документа
//   "executeUntil":"2025-09-02",// колонка Исполнить До
//   "inNum": "3469",// колонка Вх.номер
//   "indate": "2025-09-02",// колонка Дата вх.
//   "exequtor": [//колонка Исполнение
//     {
//       "id": "156042",// id исполнителя
//       "nameF": "Фалтейсек Юлия Константиновна",//  ФИО исполнителя
//       "name": "__Канцелярия__",// название исполнителя
//       "kontrol": "0",// колонка Контролирующий(включен/отключен)
//       "count": "2", // колонка Кол-во человек ознакомились
//       "sent": "Для ознакомления",// колонка Направлено
//       "status": "Согласована", //статус исполнителя
//       "statusId": "1", //статус исполнителя(id) для каждого статус а свой id
//       "untilDate": "2025-09-02 16:02:24",// дата
//       "task": ""// колонка Задача
//     }
//   ],
//   "notes": [],// колонка Заметки
//   "files": { // колонка Файлы
//     "upLt": {
//       "href": "/sedo_kkkk/letters/inmails/16882id/16882_upLt.pdf",
//       "name": "Письмо"
//     }
//   },
  
// }
// ],
// "outgoingMessages":[],//исходящие сообщения ,что должно в них отражаться,конкретно по колонкам
// "service":[],//служебные сообщения,что должно в них отражаться,конкретно по колонкам
// "orders":[], //приказы,что должно в них отражаться,конкретно по колонкам
//   }];
