<script setup>

import { RouterView, RouterLink } from 'vue-router'


</script>

<template>
  <nav>
        <RouterLink to="/">Home</RouterLink><br>
        <RouterLink to="/signup">SignUp</RouterLink><br>
        <RouterLink to="/login">LogIn</RouterLink>
  </nav>
  <RouterView />
</template>


