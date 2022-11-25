<template>
    <!-- <p>{{ page_num }}</p> -->
    <div id="myForm">
        <label for="ftitulo">titulo </label><br>
        <input v-model="titulo" type="text" id="fname" name="fname"><br>
        <label for="link">link </label><br>
        <input v-model="link" type="text" id="lname" name="lname"><br>
        <label for="autor">autor </label><br>
        <input v-model="autor" type="text" id="lname" name="lname"><br><br>
        <!-- Slider -->
        <div class="slidecontainer">
            <input type="range" min="1" max="100" v-model="slider_value" class="slider" id="myRange">
            <p>{{ slider_value }}</p>
        </div>
        <!-- end slider -->
        <button @click="post_item">Save</button>
    </div>


</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useLoginStore } from '../stores/login';

const slider_value = ref(50);
const titulo = ref("");
const link = ref("");
const autor = ref("");

const loginfo = useLoginStore();

const props = defineProps({
    page_num: {
        type: String,
        required: true
    }
});

function post_item() {
  const objeto = {
    titulo: titulo.value,
    link: link.value,
    autor: autor.value,
    tipo: props.page_num,
    rating: slider_value.value,
    owner_id: localStorage.getItem('username')
  };
  console.log(objeto)
  // post shit
  axios.post(`${loginfo.url}:8000/items`, objeto)
  .then(function (response) {
    console.log('post ',response);
    titulo.value = '';
    link.value = '';
    autor.value = '';
    slider_value.value = 50;
    emit('submit')
  // emit change in list
  emit('submit')
  })
  .catch(function (error) {
    console.log('jueputa', error);
  });
};

const emit = defineEmits(['submit'])

function logg(obj="nothing to log") {
    console.log(obj)
};


</script>


<style scoped>
.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 25%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #04AA6D; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #04AA6D; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>