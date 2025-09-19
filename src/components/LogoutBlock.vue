<script setup lang="ts">
import {ref} from 'vue'
import router from "@/router";
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
  console.log("hello")
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
    <form class="">
      <div class="container-form">
        <div class="header-form">
          <h2>Центр Воспи</h2>
          <p>Вход в систему документооборота</p>
        </div>
        <br>
        <div class="field-set">
          <div class="form-input-container">
            <span class="input-item">
            &#128100;
         </span>
            <input class="form-input"  id="txt-input" type="text" placeholder="Имя пользователя" required>
          </div>
          <div class="form-input-container">
          <span class="input-item">
         &#128272;
       </span>
          <input class="form-input" type="password" placeholder="Пароль" id="pwd"  name="password" required>
            <span aria-hidden="true"  type="button" id="eye" @click="handlerShowOrHidden()">&#128065;</span>
            </div>
          <button class="log-in" @click="handlerRouter()"> Войти</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

form {
  width: 450px;
  min-height: 500px;
  height: auto;
  border-radius: 5px;
  margin: 2% auto;
  box-shadow: 0 9px 50px hsla(20, 67%, 75%, 0.31);
  padding: 2%;
  background-image: linear-gradient(-225deg, #C8D3E2 50%, #76869C 50%);
}
.container-form{
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 auto;
}

.header-form {
  margin: 2% auto 10% auto;
  text-align: center;
}

.header-form  h2 {
  font-size: 250%;
  font-family: 'Playfair Display', serif;
  color: #3e403f;
}
.header-form p {letter-spacing: 0.05em;}
.form-input-container{
  background: #fff;
  border-radius: 5px;
  margin-bottom: 5px;
}
.input-item {
  color: #333;
  padding: 14.5px 0px 15px 10px;
  border-radius: 5px 0px 0px 5px;
}
#eye {
  color: #333;
  margin: 5.9px 0 0 0;
  margin-left: -20px;
  padding: 15px 9px 19px 0px;
  cursor: pointer;
  float: right;
  position: relative;
  right: 1%;
  top: -.2%;
  z-index: 5;
}
.form-input{
  width: 240px;
  height: 50px;
  margin-top: 2%;
  padding: 15px;
  font-size: 16px;
  font-family: 'Abel', sans-serif;
  color: #5E6472;
  outline: none;
  border: none;
  border-radius: 0px 5px 5px 0px;
  transition: 0.2s linear;
}
input[id="txt-input"] {width: 250px;}
input:focus {
  transform: translateX(-2px);
  border-radius: 5px;
}
button {
  display: inline-block;
  color: #f3f4f5;
  width: 280px;
  height: 50px;
  padding: 0 20px;
  background: #1E293B;
  border-radius: 5px;
  outline: none;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s linear;
  margin: 7% auto;
  letter-spacing: 0.05em;
}
button:hover {
  transform: translatey(3px);
  box-shadow: none;
}

button:hover {
  animation: ani9 0.4s ease-in-out infinite alternate;
}
@keyframes ani9 {
  0% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(5px);
  }
}

</style>
