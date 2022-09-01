
<template>
 <h1 style="color:orangered">Listapp</h1><br>
 <button :id="p == page_num ? 'selecb' : 'not_selected'" @click="cambiar(p)" v-for="p in page_opt">{{ p }}</button><br>
 <InputMedi @submit="rerender" :page_num="page_num"></InputMedi><br>
 <ListShow :submited="submited" :page_num="page_num"></ListShow> 
</template>

<script setup>
  import InputMedi from './InputMedi.vue';
  import ListShow from './ListShow.vue';

  import { ref } from 'vue';
  
  // logged username
  
  // logic for changing content page
  const page_opt = [
    'libros',
    'articulos',
    'peliculas',
    'podcasts'
  ];
  const page_num = ref('libros');
  
  function cambiar(nueva) {
    page_num.value = nueva;
    console.log(page_num.value)
  };
  // style for selected button
  // const isSelected = computed(() =>
  // )

  // rerender component
  function rerender() {
    submited.value++;
  };
  const submited = ref(0)
</script>

<style scoped>
#selecb {
  background-color: green
}
</style>