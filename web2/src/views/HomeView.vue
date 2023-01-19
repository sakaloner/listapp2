<script setup>
import SearchBar from '../components/SearchBar.vue'
import MainBox from '../components/MainBox.vue';
import NavBar from '../components/NavBar.vue';

</script>

<template>
  <main>
    <NavBar />
    <div class="bodyContainer">
      <SearchBar searchMsg="Busca en tu mente" />
      <MainBox />
    </div>
    
  </main>
</template>

<style>
.bodyContainer{
  padding:10px;
  display:flex;
  padding-left:11%;
  flex-direction: column;
  gap:20px;
  width: 85%;
}
</style>
