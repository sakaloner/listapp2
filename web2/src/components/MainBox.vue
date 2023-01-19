<script setup>
import ItemCard from './ItemCard.vue';

</script>

<template>
  <div class="container">
    <div class="boxContainer">
      <ItemCard content="perrito" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="cosita" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="labrita" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="monita" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="pecadito1" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="pecadito29" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="pecadito29" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="pecadito29" rating=58 tags="['cosa', 'lacrose']" />
      <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
    </div>
    <div class="carruselContainer">
      <h1>Videos</h1>
      <div class="items">
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
      </div>
    </div>
    <div class="carruselContainer">
      <h1>Libros</h1>
      <div class="items">
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
      </div>
    </div>
    <div class="carruselContainer">
      <h1>Peliculas</h1>
      <div class="items">
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
        <ItemCard content="pecadito29 asdfafffffffffffffff" rating=58 tags="['cosa', 'lacrose']" />
      </div>
    </div>
  </div>


</template>

<style scoped>

.items {
  display:flex;
  overflow:auto;
}
.boxContainer {
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  border:3px solid black;
  border-radius: 10px;
  height:50vh;
  overflow:auto;
}

</style>
