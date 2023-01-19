<script setup>
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
  }
})

</script>

<template>
  <div class="itemCardContainer">
    <p>{{ props.content }}</p>
  </div>
</template>

<style scoped>
.itemCardContainer{
  flex: 1 0 21%;
  background-color: black;
  border-radius: 10px;
  color:white;
  margin:10px;
  text-align: center;
  height: 30%
}
</style>
