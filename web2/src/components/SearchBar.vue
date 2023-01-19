<script setup>
import { ref } from 'vue'
const searchValue = ref('')

const props = defineProps({
  searchMsg: String,
})

</script>

<template>
  <div class="container">
    <input :value="searchValue" :placeholder="searchMsg"/>
  </div>
</template>

<style scoped>

input {
  width:100%;
  height: 100%;
  font-size: 30px;
  text-align:center;
  border: 3px solid black;
  border-radius: 10px;
}
</style>
