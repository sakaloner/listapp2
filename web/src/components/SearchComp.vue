
<template>
    <h1>Search Component</h1>
    <input type="text" v-model="search_value"><br>
    <p><a href="/user_profile">tico</a>{{search_value}}</p>
    <input id="categories" type="radio" name="type_search" value="category" checked> category<br>
    <input id="users" type="radio" name="type_search" value="user"> user<br>
    <button @click="searchIt()">Search</button>
  
    <div v-if="results.type == 'user_search'">{{results.data.email}}</div>
    <div v-else-if="results.type == 'category_search'">
      <ul v-for="category in results.data">
        <li>
        {{category.category_name}} from:{{category.owner_id}}

        <button v-if="meta_lists[category.owner_id] == 0"  @click="showList(category.category_name, category.owner_id)">show list</button>
        <button v-else @click="showList(category.category_name, category.owner_id)">hide list</button><br>
        
        <ul v-if="meta_lists[category.owner_id] == 1" v-for="item in lists_expanded[category.owner_id]">
          <!-- <li>{{item}}</li> -->
          <li><a :href="item.link">{{item.titulo}}</a></li>
          <li>{{item.autor}}</li>
          <li>{{item.rating}}</li>
        </ul>
        </li>
      </ul>
    </div>
    <div v-else-if="results.type == 'empty_search'">No results for that query</div>
    <div v-else>Search for a category or an user</div>
                <!-- 
    <div id="results" v-for="result in results"> 
      <p>{{result}}</p>
    </div>  -->
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useLoginStore } from '../stores/login';


const loginfo = useLoginStore();
// get username from local storage
const username = localStorage.getItem('username');

// get the search bar value from father props
const search_value = ref("");

const results = reactive({type: '', data: ''});
const lists_expanded = reactive({});

const meta_lists = ref({});


function searchIt(){
  results.type = '';
  results.data = '';
  console.log('seraching..');
  console.log(search_value.value);
  if(document.getElementById('users').checked) {
  //Male radio button is checked
  axios.get(`http://localhost:8000/users/${search_value.value}`,
  {
    headers: {
      'accept': 'application/json'
    }
  }).then(function (response) {
    console.log('response',response.data);
    results.type = 'user_search';
    results.data = response.data;
    console.log('objeto', results);
  }).catch(function (error) {
    console.log('jueputa', error);
    results.type = 'empty_search';
    results.data = '';
    console.log(results)
  });
  } else if (document.getElementById('categories').checked) {
    console.log('searching for a category');
    // log the category, empty value and skip name
    console.log('cosas', search_value.value, username);
    axios.get('http://localhost:8000/search_category',
    { 
      params: {
        category: search_value.value,
        empty: 0,
        skip: username,
      },
      headers: {
        'accept': 'application/json'
      }
    }).then(function (response) {
      console.log('response',response.data);
      if (response.data.no_results == true) {
        console.log('yessss');
        results.type = 'empty_search';
        results.data = '';
      } else {
        results.type = 'category_search';
        response.data.forEach(element => {
          //console.log('element', element.owner_id);
          //console.log(meta_lists.value);
          meta_lists.value[element.owner_id] = 0;
          //meta_lists.value[element] = 0;
        });
        console.log(meta_lists.value)
        results.data = response.data;
      }
    }).catch(function (error) {
      console.log('jueputa', error);
      results.type = 'empty_search';
      results.data = '';
    });

  }
}

function showList(category, owner_id) {
  console.log('antes', meta_lists.value[owner_id]);
  if (meta_lists.value[owner_id] == 1){
    meta_lists.value[owner_id] = 0;
  } else {
    meta_lists.value[owner_id] = 1;
  };

  console.log('showing list');
  axios.get('http://localhost:8000/get_items_by_category',
  { params: {
    category: category,
    user: owner_id
  },
    headers: {
      'accept': 'application/json'
    }
  }).then(function (response) {
    console.log('response',response.data);
    lists_expanded[owner_id] = response.data;

  }).catch(function (error) {
    console.log('jueputa', error);
  });
}
</script>


<style scoped>

</style>