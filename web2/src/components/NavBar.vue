<script setup>
  import IconTooling from './icons/IconTooling.vue'
  import { RouterLink, RouterView } from "vue-router";

</script>

<template>
  <div class="sidenav">
    <div class="logoContainer">
      <IconTooling class="logo" />
    </div>
    <div class="navItems">
      <div class="link">Archive</div>
      <div class="link">Explore</div>
      <RouterLink class="link" to="/categories">Categories</RouterLink>
      <RouterLink class="link" to="/">Main</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.link {
  color: white;
  text-decoration: none;
}
.logoContainer {
  padding-left: 40%;
  padding-top: 30%;
  transform: scale(2.0);
  color:white;
}
.sidenav {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 11%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(13, 63, 212);
}
.navItems {
  display:flex;
  flex-direction: column;
  gap:50px;
  align-items: center;
  position:absolute;
  bottom: 50px;
  left: 25%;
  font-size: 20px;
}
.navItems *:hover {
  color: green
}
</style>
