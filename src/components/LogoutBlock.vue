<script setup lang="ts">
import {ref} from 'vue'
import router from "@/router";
import logoUrl from "@/assets/Logo.jpg";

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

function show() {
  let p:any = document.getElementById('pwd');
  p.setAttribute('type', 'text');
}

function hide() {
  let p:any = document.getElementById('pwd');
  p.setAttribute('type', 'password');
}

let pwShown =ref(0);
function handlerShowOrHidden(){
  if (pwShown.value == 0) {
    pwShown.value = 1;
     show();
 } else {
    pwShown.value = 0;
   hide();
  }
}

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Введите имя пользователя и пароль';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await fetch('http://127.0.0.1:1985/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });
    
    if (!response.ok) {
      throw new Error('Неверные учетные данные');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    router.push("/main");
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка входа';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="overlay">
    <form class="auth-card max-w-md mx-auto mt-16">
      <div class="container-form">
        <div class="header-form">
          <img :src="logoUrl" alt="Логотип" class="mx-auto mb-3" style="width:72px;height:auto;" />
          <p class="text-slate-600 text-sm">Вход в систему документооборота</p>
        </div>
        <div class="field-set">
          <div v-if="error" class="auth-error mb-3">
            {{ error }}
          </div>
          <div class="form-input-container">
            <input 
              class="auth-input" 
              id="txt-input" 
              type="text" 
              placeholder="Имя пользователя" 
              v-model="username"
              required
            >
          </div>
          <div class="form-input-container relative mt-3">
            <input 
              class="auth-input pr-10" 
              type="password" 
              placeholder="Пароль" 
              id="pwd" 
              name="password" 
              v-model="password"
              required
            >
            <span aria-hidden="true"  type="button" id="eye" @click="handlerShowOrHidden()" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);cursor:pointer;">&#128065;</span>
          </div>
          <div class="auth-actions" style="justify-content:center;">
            <button 
              type="button" 
              class="auth-button" 
              @click="handleLogin"
              :disabled="loading"
            >
              {{ loading ? 'Вход...' : 'Войти' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Keep only minimal layout helpers; main styles come from global auth classes */
.overlay { padding: 0 1rem; }
.container-form { display: flex; flex-direction: column; gap: 0.75rem; }
.header-form { text-align: center; margin-bottom: 0.5rem; }
.form-input-container { }
#eye { color: #333; }
</style>
