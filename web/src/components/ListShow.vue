<script setup>
import { ref, watch, computed, onMounted, reactive  } from 'vue';
import { useLoginStore } from '../stores/login';
import axios from 'axios';
import { createSimpleExpression } from '@vue/compiler-core';

// pinia store setup


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

// show login message
const error_msg = reactive({
  msg: '',
  show: false
})

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
  let namero = localStorage.getItem('username');
  // if (namero == null)  {
  //   setTimeout(get_lists(page_value), 5000);
  // }
  console.log(namero);
  axios.get('http://localhost:8000/', {
      params: {
        tipo: page_value,
        owner_id: namero
      }
    })
    .then(function (response) {
      const {data} = response
      console.log('res func', data, typeof(data));
      lists.data = data
      return data;
    })
    .catch(function (error) {
      if (error.response.status == 401) {
        error_msg.msg = 'Login to see your lists';
        error_msg.show = true;
        return 0;
      } else {
        error_msg.msg = 'Something went wrong';
        error_msg.show = true;
        console.log(error);
        return error
      }
    });
};

function delete_item(id, tipo) {
  console.log('##########################')
  console.log(`id: ${id}, tipo: ${tipo}`);
  axios.delete('http://localhost:8000/delete', {
    headers: {
      accept: 'application/json'
    },
    params : {
      id: id,
      tipo: tipo
    }
  })
  .then(function (response) {
    console.log('deleted ', response);
    get_lists(props.page_num)
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  })
  .catch(function (error) {
    console.log(error);
  })
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
  <p v-if="error_msg.show">{{error_msg.msg}}</p>
  <div v-if="show_data">ld [ {{ lists.data }} ]</div>
  <ul v-for="lista in lists.data">
    <li> <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">{{ lista.titulo }}</a></span></li>
    <li> {{ lista.autor }}</li>
    <li> {{ lista.link }}</li>
    <li> {{ lista.rating }}</li>
    <button @click="delete_item(lista.id, lista.tipo)">del</button>
    <br><br>
  </ul>
  <!-- <button @click="sho_data">button</button> -->

</template>