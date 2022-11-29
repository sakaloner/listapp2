<script setup>

import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/login';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// get store information
const loginfo = useLoginStore();

const username = computed(() => {
  return localStorage.getItem('username');
});
// log out function button

function log_out() {
  loginfo.log_out();
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  location.reload(true)
}
const valor_input = ref("");
const router = useRouter();

function push() {
  console.log(valor_input.value);

  router.push('Search');
}

</script>

<template>
  <div class="login_info">
    <p v-if="loginfo.name">Logged as: {{loginfo.name}}</p>
    <p v-else-if="username">Logged as: {{username}}</p>
    <p v-else>Not logged in</p>
    <button v-if="loginfo.name" @click="log_out">log out</button>
    <button v-else-if="username" @click="log_out">log out</button>
    <p v-else></p>
  </div>


  <nav class="navbar navbar-dark bg-dark">
    <li class="nav-item"><RouterLink to="/" >Home</RouterLink></li>
    <li class="nav-item"><RouterLink to="/signup">SignUp</RouterLink></li>
    <li class="nav-item"><RouterLink to="/login">LogIn</RouterLink></li>
    <li class="nav-item"><RouterLink to="/Explore">Explore Lists</RouterLink></li>
    <li class="nav-item"><RouterLink to="/Search" >Search</RouterLink></li>
    <li class="nav-item"><RouterLink to="/Archive">Archive</RouterLink></li>
  </nav>
  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>


</template>


