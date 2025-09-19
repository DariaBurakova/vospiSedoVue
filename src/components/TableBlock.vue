<script setup>
import TableBody from "@/components/TableBody.vue";
import { ref } from 'vue';

const columnsData = ref([{
  "id": "16882",
  "outnom": "23164/096-2025",
  "outdate": "2025-09-02",
  "delivery": "rpkb@rpkb.ru",
  "org": "АО «РПКБ»",
  "orgId": "151",
  "postId": "176",
  "signer": "О.И.Брыляев",
  "signerId": "12850",
  "dolj": "Директор по кооперации и МТО",
  "content": "Уточнение банковских реквизитов к дг.99-25/Ц 28.04.2025",
  "outType": "Договор",
  "innom": "3469",
  "indate": "2025-09-02",
  "till": null,
  "exequtor": [
    {
      "id": "156042",
      "parentRowId": "0",
      "userId_from": "9",
      "nameF": "Фалтейсек Юлия Константиновна",
      "userId_to": "1",
      "name": "__Канцелярия__",
      "level": 0,
      "kontrol": "0",
      "coment": "",
      "mainExequtor": "0",
      "answerNeed": "2",
      "answerNeed_e": "Для ознакомления",
      "sogl": "1",
      "sogl_e": "Согласована",
      "till": null,
      "prosr": null,
      "ts": "2025-09-02 16:02:24",
      "comentCount": "0"
    }
  ],
  "files": {
    "upLt": {
      "href": "/sedo_kkkk/letters/inmails/16882id/16882_upLt.pdf",
      "name": "Письмо"
    }
  },
  "sendTktUID": "",
  "ackUID": "",
  "ts": "2025-09-02 16:02:24",
  "active": "1",
  "mailChain": [
    {
      "table": "outmails",
      "mail_id": "24269",
      "outType": "В ответ на",
      "outnom": "5215",
      "outdate": "2025-09-04"
    }
  ],
  "notes": []
}]);

// const columnsData=[
//   {
//   numberDocument: '12/348670',
//   dateDocument: '12.11.2024',
//   links: [{id:1,link:'В/33-08 от 30.12.2023'}, {id:2,link:'ВH/32-08 от 30.12.2023'}],
//   showMore: true,
//   nameCompany: 'ООО «Компания»',
//   nameResponsibility: 'А. Т. Константинов',
//   namePosition:'Генеральный директор',
//   text:'Текст приказа по основной деятельности делится на две части. Первая – констатирующая. В ней приводится основание для издания приказа.',
//   email:'email@mail.com',
//   performerDate:'12.11.2024',
//   numberIn:'12/348670',
//   dateIn:'12.11.2024',
//   label: 'Канцелярия',
//   checked: true,
//   counter: 5,
//   name: 'К. Александров',
//   unchecked: false,
//   placeholder: 'добавить заметку',
//   valueText: 'Содержит текст заметки',
//   letter: 'Письмо',
//   notes: [],
// },
//   {
//     numberDocument: '12/348670',
//     dateDocument: '12.11.2024',
//     links: [{id:1,link:'В/33-08 от 30.12.2023'}, {id:2,link:'ВH/32-08 от 30.12.2023'}],
//     showMore: true,
//     nameCompany: 'ООО «Компания»',
//     nameResponsibility: 'А. Т. Константинов',
//     namePosition:'Генеральный директор',
//     text:'Текст приказа по основной деятельности делится на две части. Первая – констатирующая. В ней приводится основание для издания приказа.',
//     email:'email@mail.com',
//     performerDate:'12.11.2024',
//     numberIn:'12/348670',
//     dateIn:'12.11.2024',
//     label: 'Канцелярия',
//     checked: true,
//     counter: 5,
//     name: 'К. Александров',
//     unchecked: false,
//     placeholder: 'добавить заметку',
//     valueText: 'Содержит текст заметки',
//     letter: 'Письмо',
//   },
//   {
//     numberDocument: '12/348670',
//     dateDocument: '12.11.2024',
//     links: [{id:1,link:'В/33-08 от 30.12.2023'}, {id:2,link:'ВH/32-08 от 30.12.2023'}],
//     showMore: true,
//     nameCompany: 'ООО «Компания»',
//     nameResponsibility: 'А. Т. Константинов',
//     namePosition:'Генеральный директор',
//     text:'Текст приказа по основной деятельности делится на две части. Первая – констатирующая. В ней приводится основание для издания приказа.',
//     email:'email@mail.com',
//     performerDate:'12.11.2024',
//     numberIn:'12/348670',
//     dateIn:'12.11.2024',
//     label: 'Канцелярия',
//     checked: true,
//     counter: 5,
//     name: 'К. Александров',
//     unchecked: false,
//     placeholder: 'добавить заметку',
//     valueText: 'Содержит текст заметки',
//     letter: 'Письмо',
//   },
//   {
//     numberDocument: '12/348670',
//     dateDocument: '12.11.2024',
//     links: [{id:1,link:'В/33-08 от 30.12.2023'}, {id:2,link:'ВH/32-08 от 30.12.2023'}],
//     showMore: true,
//     nameCompany: 'ООО «Компания»',
//     nameResponsibility: 'А. Т. Константинов',
//     namePosition:'Генеральный директор',
//     text:'Текст приказа по основной деятельности делится на две части. Первая – констатирующая. В ней приводится основание для издания приказа.',
//     email:'email@mail.com',
//     performerDate:'12.11.2024',
//     numberIn:'12/348670',
//     dateIn:'12.11.2024',
//     label: 'Канцелярия',
//     checked: true,
//     counter: 5,
//     name: 'К. Александров',
//     unchecked: false,
//     placeholder: 'добавить заметку',
//     valueText: 'Содержит текст заметки',
//     letter: 'Письмо',
//   },
//   {
//     numberDocument: '12/348670',
//     dateDocument: '12.11.2024',
//     links: [{id:1,link:'В/33-08 от 30.12.2023'}, {id:2,link:'ВH/32-08 от 30.12.2023'}],
//     showMore: true,
//     nameCompany: 'ООО «Компания»',
//     nameResponsibility: 'А. Т. Константинов',
//     namePosition:'Генеральный директор',
//     text:'Текст приказа по основной деятельности делится на две части. Первая – констатирующая. В ней приводится основание для издания приказа.',
//     email:'email@mail.com',
//     performerDate:'12.11.2024',
//     numberIn:'12/348670',
//     dateIn:'12.11.2024',
//     label: 'Канцелярия',
//     checked: true,
//     counter: 5,
//     name: 'К. Александров',
//     unchecked: false,
//     placeholder: 'добавить заметку',
//     valueText: 'Содержит текст заметки',
//     letter: 'Письмо',
//   },
//   {
//     numberDocument: '12/348670',
//     dateDocument: '12.11.2024',
//     links: [{id:1,link:'В/33-08 от 30.12.2023'}, {id:2,link:'ВH/32-08 от 30.12.2023'}],
//     showMore: true,
//     nameCompany: 'ООО «Компания»',
//     nameResponsibility: 'А. Т. Константинов',
//     namePosition:'Генеральный директор',
//     text:'Текст приказа по основной деятельности делится на две части. Первая – констатирующая. В ней приводится основание для издания приказа.',
//     email:'email@mail.com',
//     performerDate:'12.11.2024',
//     numberIn:'12/348670',
//     dateIn:'12.11.2024',
//     label: 'Канцелярия',
//     checked: true,
//     counter: 5,
//     name: 'К. Александров',
//     unchecked: false,
//     placeholder: 'добавить заметку',
//     valueText: 'Содержит текст заметки',
//     letter: 'Письмо',
//   },]


import TableHeader from "@/components/TableHeader.vue";
</script>
<template>
  <div class=" fixed top-0 px-4 rounded-md overflow-auto w-full z-30 mt-35 overflow-table">
    <div class="">
      <table  class="border border-gray-200">
        <thead class="sticky-header">
       <table-header class=" "/>
        </thead>
        <tbody class="" >
        <tr class=" hover:bg-gray-50" v-for="(col, index) in columnsData" :key="index">
          <table-body  :data="col"/>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
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

