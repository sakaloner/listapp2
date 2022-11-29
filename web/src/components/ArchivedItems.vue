<script setup>
import { ref, watch, computed, onMounted, reactive  } from 'vue';
import { useLoginStore } from '../stores/login';
import axios from 'axios';
import SliderThing from './SliderThing.vue';

onMounted(() => {
  console.log(`the component is now mounted.`);
  //get_lists();
});

const loginfo = useLoginStore();
const current_category = ref('');
const categories = ref([]);
const current_list = ref(0);
const username = localStorage.getItem('username');
const follow_button = ref('');
const slider_value = ref(0);
const lists = reactive({});

const edit_mode = reactive({
  'active': 0,
  'item_id': undefined,
})

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

const getCategories = async () => {
  const categories = await axios.get(`${loginfo.url}:8000/get_categories/${username}`,{
    headers: {
      'accept': 'application/json'
    }
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err)
      return err
    });
  console.log('categories', categories);
  return categories;
}

async function get_lists(category_type) {
  const lista = await axios.get(`${loginfo.url}:8000/`, {
      params: {
        tipo: category_type,
        owner_id: username,
        archived: 1,
      }
  })
    .then((response) => {
      return response;
    });
  console.log('result lista', lista);
  return lista;
};

getCategories()
  .then((res) => {
    console.log('categories', res);
    categories.value = res;
    console.log('first_category', res[0]);
    get_lists(res[0])
      .then((respuesta) => {
        console.log('items in list', respuesta.data);
        if (respuesta.length = 0) {
          current_list.value = 'empty';
        }
        else {
          current_list.value = respuesta.data;
        }
      })
  });

function change_category(new_category) {
  console.log('new_category', new_category);
  current_category.value = new_category;
  console.log('current list', current_list.value);
  // get_lists(new_category)
  //   .then((res) => {
  //     console.log('lists', res.data);
  //     current_list.value = res.data;
  //   })
};



function delete_item(id, tipo) {
  console.log('##########################')
  console.log(`id: ${id}, tipo: ${tipo}`);
  axios.delete(`${loginfo.url}:8000/delete`, {
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
  axios.put(`${loginfo.url}:8000/update_item`, plainObject, {
    headers: {
      accept: 'application/json'
    },
  }).then(function (response) {
    console.log('updated ', response);
    edit_mode.active = 0;
    edit_mode.item_id = undefined;
    get_lists(props.page_num);
  });
  
};

const archiving = ref(0)
function archive(lista) {
  console.log('archive function');
  archiving.value = lista.id;

};

function de_archive(lista){
  let plainObject = { ...lista };
  plainObject['archived'] = 0;
  plainObject['rating'] = slider_value.value;
  plainObject['archived_rating'] = undefined;
  axios.put(`${loginfo.url}:8000/update_item`, plainObject, {
    headers: {
      accept: 'application/json'
    },
  }).then(function (response) {
    console.log('updated ', response);
    archiving.value = 0;
    get_lists(current_list.value)
      .then((respuesta) => {
          console.log('lists', respuesta.data);
          if (respuesta.data.length = 0) {
            current_list.value = 'empty';
          }
          else {
            current_list.value = respuesta.data;
          }
        });
  });
};

function changeSlider(value) {
  console.log('change slider', value);
  slider_value.value = value;
};

watch(
  () => current_category.value,
  (page_num) => { 
    console.log(`p is now ${page_num}`);
    get_lists(page_num)
      .then((res) => {
        console.log('lists', res.data);
        current_list.value = res.data;
      })
  },
);


</script>

<template>
  <h1>{{username}}'s Archive</h1><br>
  <button @click="change_category(category)" :id="category == current_category ? 'selecb' : 'not_selected'" v-for="category in categories">{{ category }}</button>
  <br><br>

  <p v-if="current_list == 0">El usuario no tiene items aqui</p>
  <!-- 
  <ul v-for="lista in current_list">
    <li> <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">titulo: {{ lista.titulo }}</a></span></li>
    <li>autor: {{ lista.autor }}</li>
    <li>rating: {{ lista.rating }}</li>
    <button @click="delete_item(lista.id, lista.tipo)">del</button>
    <br><br>
  </ul> -->

  <p v-if="error_msg.show">{{error_msg.msg}}</p>

  <ul v-for="lista in current_list">
    <div v-if="lista.id == edit_mode.item_id">
      <li>titulo: <input type="text" v-model="lista.titulo"></li>
      <li>link: <input type='text' v-model="lista.link"></li>
      <li>autor: <input type="text" v-model="lista.autor"></li>
      <li>rating:   <SliderThing @moved_slider="changeSlider" /></li>
      <button @click="delete_item(lista.id, lista.tipo)">delete</button>
      <button @click="save_edit_item(lista)">Save</button>
    <br><br>
    </div>

    <div v-else-if="lista.id == archiving">
      <li>titulo: <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">{{ lista.titulo }}</a></span></li>
      <li>autor: {{ lista.autor }}</li>
      <li>How much do you want to consume this?</li>
      <SliderThing @moved_slider="changeSlider" />
      <button @click="de_archive(lista)">Send to the main hub</button>
      <button @click="archiving = 0">cancel</button>
    </div>

    <div v-else>
      <li>titulo: <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">{{ lista.titulo }}</a></span></li>
      <li>autor: {{ lista.autor }}</li>
      <li>rating: {{ lista.rating }}</li>
      <button @click="delete_item(lista.id, lista.tipo)">delete</button>
      <button @click="edit_item(lista.id, lista.tipo)">edit</button>
      <button @click="archive(lista)">de_archive</button>
      <br><br>
    </div>

  </ul>

</template>