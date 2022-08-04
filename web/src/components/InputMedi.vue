<template>

    <form>
        <label for="fname">Name: </label><br>
        <input type="text" id="fname" name="fname"><br>
        <label for="lname">Link: </label><br>
        <input type="text" id="lname" name="lname"><br>
        <label for="lname">Autor: </label><br>
        <input type="text" id="lname" name="lname"><br>
        <button>Add</button>
    </form> 


</template>

<script setup>



defineProps({
    page_num: {
        type: String,
        required: true
    }
})
</script>