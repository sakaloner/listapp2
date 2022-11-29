
<template>
 <h1><p style="color:blue"></p></h1>
 <h1 style="color:orangered; align-self: center;">Listapp</h1><br>
 <button :id="p == page_num ? 'selecb' : 'not_selected'" @click="cambiar(p)" v-for="p in page_opt">{{ p }}</button>
 <button style="color:red" @click="modo_borrar_cats()">borrar categorias</button>
 <button style="color:green" @click="create_new_cat()">+</button>
 <input v-if="creating_cat == 1" type="text" name="new_cat" v-model="new_category_name" >
 <button v-if="creating_cat == 1" @click="post_new_cat()">post</button>

 <InputMedi @submit="rerender" :page_num="page_num"></InputMedi><br>
 <ListShow :submited="submited" :page_num="page_num"></ListShow> 
</template>

<script setup>
  import InputMedi from './InputMedi.vue';
  import ListShow from './ListShow.vue';
  import { useLoginStore } from '@/stores/login';
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  const new_category_name = ref("");
  // erasing categories
  const erase_cats = ref(0)
  const creating_cat = ref(0)
  // logged username
  const loginfo = useLoginStore();
  const username = computed(() => {
    return localStorage.getItem('username');
  });
  // get the category names
  const page_opt = ref('');
  const page_num = ref(''); // selected category

  function get_category_data() {
    axios.get(`${loginfo.url}:8000/get_categories/${username.value}`, {
    })
    .then(function (response) {
      console.log('categorias',response.data);
      page_opt.value = response.data;
      page_num.value = response.data[0];
    })
    .catch(function (error) {
      console.log('jueputa', error);
    });
  };
  get_category_data()

  // creating new category
  function create_new_cat() {
    creating_cat.value = 1;

  };
  function post_new_cat(){
    console.log(new_category_name.value)
    fetch(`${loginfo.url}:8000/cat_creation?owner_id=${username.value}&category_name=${new_category_name.value}`, {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
      }
    })
      .then(function (response) {
        console.log('resultado ',response);
        get_category_data()
        creating_cat.value = 0;
      })
      .catch(function (error) {
        console.log('jueputa', error);
      });
  };


  // logic for changing content page

  //const page_num = ref(page_opt);
  function modo_borrar_cats(){
    erase_cats.value = 1;
  };

  function cambiar(nueva) {
    if (erase_cats.value == 1) {
      if (confirm('Seguro deseas borrar '+ nueva)){
        axios.delete(`${loginfo.url}:8000/delete_cat?name_category=${nueva}&usuario=${username.value}`)
          .then(function (response) {
            get_category_data();
            console.log(`borraste la categoria ${nueva}`);
            erase_cats.value = 0;
          })
          .catch(function (error) {
            console.log('jueputa', error);
            
          });
      } else {
        erase_cats.value = 0;
      };
    } else {
      page_num.value = nueva;
      console.log(page_num.value);

    }
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