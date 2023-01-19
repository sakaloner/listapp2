<script setup>
import ItemCard from './ItemCard.vue';
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  // tags: {
  //   type: Array[String],
  //   required: false
  // },
  // rating: {
  //   type: Number,
  //   required: true
  // }
})
const itemsInCarousel = [
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
  {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
]

</script>

<template>
  <div class="carruselContainer">
        <h1>{{ props.title }}</h1>
        <div class="items">
          <ItemCard v-for="item in itemsInCarousel" type="carousel" :content="item.content" :rating="item.rating" :tags="item.tags" />
        </div>
      </div>
</template>

<style scoped>
.items{
  display:flex;
  overflow:auto;
}
</style>
