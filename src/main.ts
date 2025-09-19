import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import VueDatePicker from '@vuepic/vue-datepicker';
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(PrimeVue,{
  unstyled: true,

})
app.component('VueDatePicker', VueDatePicker)
app.mount('#app')
