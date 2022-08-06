<script setup>
import { ref, computed, onMounted, reactive  } from 'vue';
import axios from 'axios';

onMounted(() => {
  console.log(`the component is now mounted.`);
  pene = get_lists()
  console.log(pene)

})

var pene;

function get_lists() {
  axios.get('http://localhost:8000/', {
      params: {
        tipo: 'libros'
      }
    })
    .then(function (response) {
      console.log('res func', response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const list_data = computed(() => {
  return pene
});



defineProps({
  page_num: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <br>
  <button @click="get_lists">log</button>
  <div>{{ list_data }}</div>
  <div>{{ datas }}</div>

  <!-- <div>
    <ul v-for="el in listas">
      <li>{{ el.ano }}</li>
      <li>{{ el.fecha }}</li>
      <li>{{ el.nombre }}</li>
      <button>Erase</button>
      <button>Edit</button>
      <br>
    </ul>
  </div> -->
  <br>
  <p>Pagina: {{ page_num }}</p>

</template>