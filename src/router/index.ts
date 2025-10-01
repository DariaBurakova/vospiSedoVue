import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from "@/views/MainView.vue";
import InboxView from "@/views/InboxView.vue";
import OutGoingView from "@/views/OutGoingView.vue"
import OfficialView from "@/views/OfficialView.vue";
import OrdersView from "@/views/OrdersView.vue";

// Check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/main',
      name: 'about',
      component: MainView,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next('/');
        }
      },
      children:[
        {
          path:'',
          redirect: '/main/inbox'
        },
        {
          path:'inbox',
          component: InboxView,
          name:'Входящие',
        },
        {
          path:'outgoing',
          component: OutGoingView ,
          name:'Исходящие',
        },
        {
          path:'official',
          component:OfficialView ,
          name:'Служебные',
        },
        {
          path:'orders',
          component: OrdersView ,
          name:'Приказы',
        },
      ]
    },
  ],
})

export default router
