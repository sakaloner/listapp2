<script setup>
import { ref, watch, computed, onMounted, reactive } from 'vue';
import Router from "../router";
import { useRouter, useRoute } from "vue-router";
import { useLoginStore } from '../stores/login';
import axios from 'axios';
import { createSimpleExpression } from '@vue/compiler-core';




const loginfo = useLoginStore();
// pinia store setup
const router = useRouter();
const route = useRoute();

console.log('user_to_find', route.params.id);
const user_to_show = route.params.id;

const current_category = ref('videos');
const categories = ref([]);
const current_list = ref(0);
const username = localStorage.getItem('username');
const follow_button = ref('');


onMounted(() => {
  console.log(`the component is now mounted.`);
  is_following();
})

async function getCategories() { 
  const categories = await axios.get(`${loginfo.url}:8000/get_categories/${user_to_show}`, {
  headers: {
    'accept': 'application/json'
  }
  });
  return categories;
};

async function get_lists(category_type) {
  const lista = axios.get(`${loginfo.url}:8000/`, {
      params: {
        tipo: category_type,
        owner_id: user_to_show
      }
  });
  console.log('result lista', lista);
  return lista;
};

function is_following() {
  axios.get(`${loginfo.url}:8000/is_following`,{
    params:{
      folower: username,
      folowee: user_to_show,
    },
    headers: {
      'accept': 'application/json'
    }
  })
  .then(function (response) {
    console.log('response', response.data);
    if (response.data.connected == true) {
      console.log('is following');
      follow_button.value = 'Unfollow';
    }
    else {
      console.log('is not following');
      follow_button.value = 'Follow';
    }
  })
};

function follow_or_unfollow() {
  console.log('valor boton', follow_button.value);
  if (follow_button.value == 'Unfollow') {
    console.log('trying to unfollow')
    axios.delete(`${loginfo.url}:8000/multiplayer/unfollow`, {
      params: {
        folower: username,
        folowee: user_to_show,
      },
    headers: {
      'accept': 'application/json'
    }
    })
      .then(function (response) {
        console.log('response', response.data);
        console.log('unfollowed');
        follow_button.value = 'Follow';
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if (follow_button.value == 'Follow') {
    console.log('trying to follow');
    axios.post(`${loginfo.url}:8000/multiplayer/follow`, 
    '',
    {
      params: {
        folower: username,
        folowee: user_to_show,
      },
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
      .then(function (response) {
        console.log('response', response.data);
        console.log('followed');
        follow_button.value = 'Unfollow';
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

 
getCategories()
  .then((res) => {
    console.log('users', res.data);
    categories.value = res.data
    console.log('first_value', categories.value[0]);
    get_lists('videos')
      .then((res) => {
        console.log('lists', res.data);
        if (res.data.length = 0) {
          current_list.value = 'empty';
        }
        else {
          current_list.value = res.data;
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
  <h1>User: {{user_to_show}}</h1>
  <button @click="follow_or_unfollow()" >{{follow_button}}</button>
  <p>Este es un usuario ahi normalito hay como todos</p><br>
  <button @click="change_category(category)" :id="category == current_category ? 'selecb' : 'not_selected'" v-for="category in categories">{{ category }}</button>

  <p v-if="current_list == 0">El usuario no tiene items aqui</p>
  <ul v-for="lista in current_list">
    <li> <span style="font-weight:bold; color:orange"><a :href="lista.link" target="_blank">{{ lista.titulo }}</a></span></li>
    <li> {{ lista.autor }}</li>
    <li> {{ lista.link }}</li>
    <li> {{ lista.rating }}</li>
    <button @click="delete_item(lista.id, lista.tipo)">del</button>
    <br><br>
  </ul>


  <!-- <button @click="sho_data">button</button> -->

</template>

<style scoped>
#selecb {
  background-color: green
}
</style>