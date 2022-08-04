<script setup>
import { ref } from 'vue';

const listas = ref([
  {ano:15, fecha:1998, nombre:'carlitos'},
  {ano:22, fecha:1338, nombre:'carlitos'}
])


defineProps({
  page_num: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <br>

  <div>
    <ul v-for="el in listas">
      <li>{{ el.ano }}</li>
      <li>{{ el.fecha }}</li>
      <li>{{ el.nombre }}</li>
      <button>Erase</button>
      <button>Edit</button>
      <br>
    </ul>
  </div>
  <br>
  <p>Pagina: {{ page_num }}</p>

</template>