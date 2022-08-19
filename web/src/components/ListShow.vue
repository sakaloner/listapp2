<script setup>
import { ref, watch, computed, onMounted, reactive  } from 'vue';
import axios from 'axios';

const props = defineProps({
  page_num: {
    type: String,
    required: true,
  },
  submited: {
    type: Number,
    required: true
  }
});

onMounted(() => {
  console.log(`the component is now mounted.`);
  get_lists(props.page_num);
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
};



function get_lists(page_value) {
  axios.get('http://localhost:8000/', {
      params: {
        tipo: page_value
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

function delete_item(id, tipo) {
  console.log(`id: ${id}, tipo: ${tipo}`);
  axios.delete('http://localhost:8000/delete', {
    data: {
      id: id,
      tipo: tipo
    }
  })
  .then(function (response) {
    console.log('deleted ', response);
  })
  .catch(function (error) {
    console.log(error);
  });
  get_lists(props.page_num)
};

watch(
  () => props.page_num,
  (page_num) => { 
    console.log(`p is now ${page_num}`);
    get_lists(page_num)
});

watch(
  () => props.submited,
  (sub) => {
    get_lists(props.page_num)
  }
);


</script>

<template>
  <!-- <h1>sub: [{{submited}}]</h1> -->
  <div v-if="show_data">ld [ {{ lists.data }} ]</div>
  <ul v-for="lista in lists.data">
    <li> <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">{{ lista.titulo }}</a></span></li>
    <li> {{ lista.autor }}</li>
    <li> {{ lista.link }}</li>
    <li> {{ lista.rating }}</li>
    <button @click="delete_item(6, 'libros')">del{{lista}}</button>
    <br><br>
  </ul>
  <button @click="sho_data">button</button>

</template>