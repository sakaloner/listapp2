<script setup>
import { ref, computed, onMounted, reactive  } from 'vue';
import axios from 'axios';

onMounted(() => {
  console.log(`the component is now mounted.`);
  get_lists()
});


// data
const lists = reactive({});

// function
const show_data = ref(0)
function sho_data() {
  if (show_data.value == 0) {
    show_data.value ++;
  }
  else {
    show_data.value = 0;
  }
}
function get_lists() {
  axios.get('http://localhost:8000/', {
      params: {
        tipo: 'libros'
      }
    })
    .then(function (response) {
      const {data} = response
      console.log('res func', data, typeof(data));
      lists.data = data
      return data;
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
};


defineProps({
  page_num: {
    type: String,
    required: true,
  }
});
</script>

<template>
  
  <div v-if="show_data">ld [ {{ lists.data }} ]</div>
  <ul v-for="lista in lists.data">
    <li> <span style="font-weight:bold; color:orange">{{ lista.titulo }}</span></li>
    <li> {{ lista.autor }}</li>
    <li> {{ lista.link }}</li>
    <li> {{ lista.rating }}</li>
    <br>
  </ul>
  <button @click="sho_data">button</button>

</template>