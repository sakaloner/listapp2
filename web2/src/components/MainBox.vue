<script setup>
import ItemCard from './ItemCard.vue';
const itemsInfo = [
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
  {content:'perritosdfasdfasdfsdaf', rating:58, tags:['cosa', 'lacrose']},
]

</script>

<template>
  <div class="container">
    <div class="boxContainer">
      <ItemCard v-for="item in itemsInfo" type="mainBox" :content="item.content" :rating="item.rating" :tags="item.tags" />
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
  overflow:auto;
}

</style>
