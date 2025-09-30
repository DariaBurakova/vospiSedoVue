<script setup lang="ts">
import {ref} from 'vue'
import router from "@/router";
import logoUrl from "@/assets/Logo.jpg";
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
function handlerRouter(){
  router.push("/main")
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
          <div class="form-input-container">
            <input class="auth-input"  id="txt-input" type="text" placeholder="Имя пользователя" required>
          </div>
          <div class="form-input-container relative mt-3">
            <input class="auth-input pr-10" type="password" placeholder="Пароль" id="pwd"  name="password" required>
            <span aria-hidden="true"  type="button" id="eye" @click="handlerShowOrHidden()" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);cursor:pointer;">&#128065;</span>
          </div>
          <div class="auth-actions" style="justify-content:center;">
            <button type="button" class="auth-button" @click="handlerRouter()">Войти</button>
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
