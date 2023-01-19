<script setup>
import SearchBar from '../components/SearchBar.vue'
import NavBar from '../components/NavBar.vue';
import CarouselBox from '../components/CarouselBox.vue';

</script>

<template>
  <main>
    <NavBar />
    <div class="bodyContainer">
      <SearchBar searchMsg="Busca en tu mente" />
      <CarouselBox title="Videos"/>
      <CarouselBox title="Podcasts"/>
      <CarouselBox title="Books"/>
      <CarouselBox title="Articles"/>
    </div>
  </main>
</template>

<style>
.bodyContainer{
  padding:10px;
  display:flex;
  padding-left:12%;
  flex-direction: column;
  gap:20px;
  width: 85%;
}
</style>
