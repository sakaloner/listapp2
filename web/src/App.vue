<script setup>

import { RouterView, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/login';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// get store information
const loginfo = useLoginStore();

const username = computed(() => {
  return localStorage.getItem('username');
}
);
// log out function button

function log_out() {
  loginfo.log_out();
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  location.reload(true)
}

const showb = ref(0)



</script>

<template>
  <p v-if="loginfo.name">Logged as: {{loginfo.name}}</p>
  <p v-else-if="username">Logged as: {{username}}</p>
  <p v-else>Not logged in</p>

  <button v-if="loginfo.name" @click="log_out">logOut</button>
  <button v-else-if="username" @click="log_out">logOut</button>
  <p v-else></p>

  <nav>
        <RouterLink to="/">Home</RouterLink><br>
        <RouterLink to="/signup">SignUp</RouterLink><br>
        <RouterLink to="/login">LogIn</RouterLink>
  </nav>
  <RouterView />

</template>


