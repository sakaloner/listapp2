<script setup>
  import IconTooling from './icons/IconTooling.vue'
</script>

<template>
  <div class="sidenav">
    <div class="logoContainer">
      <IconTooling class="logo" />
    </div>
    <div class="navItems">
      <div>Archive</div>
      <div>Explore</div>
      <div>Main</div>
    </div>
  </div>
</template>

<style scoped>
.logoContainer {
  padding-left: 40%;
  padding-top: 30%;
  transform: scale(2.0);
}
.sidenav {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 10%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(248, 214, 42);
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
.navItems div:hover {
  color: #f1f1f1;
}
</style>
