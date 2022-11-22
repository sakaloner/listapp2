<script setup>
import { ref, watch, computed, onMounted, reactive  } from 'vue';
import { useLoginStore } from '../stores/login';
import axios from 'axios';
import { createSimpleExpression } from '@vue/compiler-core';
import SliderThing from './SliderThing.vue';


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


const slider_value = ref(0);
const username = localStorage.getItem('username');
// data
const lists = reactive({});
const edit_mode = reactive({
  'active': 0,
  'item_id': undefined,
})
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
      console.log(response);
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
      tipo: tipo,
      usuario: username,
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

function edit_item(id, tipo) {
  console.log('edit item function');
  edit_mode.active = 1;
  edit_mode.item_id = id;
  console.log("edit_mode_thing", edit_mode.active, edit_mode.item_id);
}

function save_edit_item(lista) {
  console.log('slider_value',slider_value.value);
  let plainObject = { ...lista };
  plainObject['rating'] = slider_value.value;
  console.log('new_slider_value', plainObject.ratingcv );
  console.log('save edit item function', plainObject);
  axios.put('http://localhost:8000/update_item', plainObject, {
    headers: {
      accept: 'application/json'
    },
  }).then(function (response) {
    console.log('updated ', response);
    edit_mode.active = 0;
    edit_mode.item_id = undefined;
    get_lists(props.page_num);

  });
  
}

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

function changeSlider(value) {
  console.log('change slider', value);
  slider_value.value = value;
}

</script>

<template>

  <p v-if="error_msg.show">{{error_msg.msg}}</p>

  <ul v-for="lista in lists.data">
    <div v-if="lista.id == edit_mode.item_id">
      <li>titulo: <input type="text" v-model="lista.titulo"></li>
      <li>link: <input type='text' v-model="lista.link"></li>
      <li>autor: <input type="text" v-model="lista.autor"></li>
      <li>rating:   <SliderThing @moved_slider="changeSlider" /></li>
      <button @click="delete_item(lista.id, lista.tipo)">delete</button>
      <button @click="save_edit_item(lista)">Save</button>
    <br><br>
    </div>
    <div v-else>
      <li>titulo: <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">{{ lista.titulo }}</a></span></li>
      <li>autor: {{ lista.autor }}</li>
      <li>rating: {{ lista.rating }}</li>
      <button @click="delete_item(lista.id, lista.tipo)">delete</button>
      <button @click="edit_item(lista.id, lista.tipo)">edit</button>
      <br><br>
    </div>
  </ul>

</template>