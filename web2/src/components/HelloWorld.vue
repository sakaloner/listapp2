<script setup>

import {vue, computed, reactive} from 'vue';

defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const state = reactive({});


function get_lists() {
  axios.get('http://localhost:8000/', {
      params: {
        tipo: 'libros'
      }
    })
    .then(function (response) {
      const {data} = response
      console.log('res func', res, typeof(res));
      state.weather = data
      return res;
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
};


</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with {{state}}
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://vuejs.org/">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
