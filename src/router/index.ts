import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from "@/views/MainView.vue";
import InboxView from "@/views/InboxView.vue";
import OutGoingView from "@/views/OutGoingView.vue"
import OfficialView from "@/views/OfficialView.vue";
import OrdersView from "@/views/OrdersView.vue";
import AdminUsersView from "@/views/AdminUsersView.vue";

// isAuthenticated — простая проверка наличия токена в localStorage
function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

// isAdmin — для dev-режима читаем роль из localStorage (в проде — через JWT)
function isAdmin() {
  return localStorage.getItem('user_role') === 'admin';
}

// Роутер приложения: корень (логин), защищённый /main с вложенными разделами и отдельный /admin/users
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
      component: MainView,
      // Гард: редирект на страницу логина если нет токена
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next('/');
        }
      },
      children:[
        // По умолчанию открываем «Входящие»
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
    // Админка — доступна только роли admin (dev: localStorage)
    {
      path: '/admin/users',
      name: 'Админка — Пользователи',
      component: AdminUsersView,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated() && isAdmin()) {
          next();
        } else {
          next('/');
        }
      }
    }
  ],
})

export default router
