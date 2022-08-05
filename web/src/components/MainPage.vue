<template>
 <h1 style="color:orangered">Listapp</h1>
 <br>
 <InputMedi :page_num="page_num"></InputMedi>
 <br>
 <br>
 <br>
 <ListShow :page_num="page_num"></ListShow> 
</template>

<script setup>
  import InputMedi from './InputMedi.vue';
  import ListShow from './ListShow.vue';

  import { ref } from 'vue'
  
  const page_num = ref('Libros')
</script>