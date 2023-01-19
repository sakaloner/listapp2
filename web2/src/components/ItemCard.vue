<script setup>
import slider from "vue3-slider"
import { ref } from 'vue'
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  tags: {
    type: Array[String],
    required: false
  },
  rating: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})
const value= ref(22)
</script>

<template>
  <div class="itemCardContainer" >
    <p :class="props.type">{{ props.content }}</p>
    <slider v-model="value" color="blue" track-color="none"/>
  </div>

</template>

<style scoped>
.itemCardContainer{
  flex: 1 0 21%;
  background-color: rgb(197, 122, 8);
  border-radius: 10px;
  margin:10px;
}
.mainBox{
  margin:auto;
  padding:40px;
  text-align:center;
  font-size: 17px;
  color:white;
}
.carousel{
  margin:auto;
  padding:30px;
  text-align:center;
  font-size: 17px;
  color:white;
}
.slider {
  background-color: red;
}
</style>
