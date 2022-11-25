<template>
<br>
<h1 style="color:orangered">Register a new User</h1>
<br>
<div>
    <input v-model="email" type="text" placeholder="email"><br>
    <input v-model="password1" type="text" placeholder="password"><br>
    <input v-model="password2" type="text" placeholder="repear password"><br>
    <p :class="classy">{{error_message}}</p>
    <button @click="post_form">Create User</button>
</div>

</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useLoginStore } from '../stores/login';

const loginfo = useLoginStore();

const email = ref('');
const password1 = ref('');
const password2 = ref('');

const error_message = ref('')
const disp_error = ref(0)

//
const classy = ref('')

//post form data
function post_form() {
    console.log(`disp error ${disp_error.value}`)
    // check they inputed everything
    if (email.value == '' || password1.value == '' || password2.value == ' ') {
        classy.value = 'error'
        error_message.value = "Theres empty fields"
        return 0
    }
    // check if passwords match
    if (password1.value !== password2.value) {
        classy.value = 'error'
        error_message.value = "Passwords dont match";
        return 0
    }
    // Post with axioss
    var dats = {
        email: email.value,
        password: password1.value
    };
    console.log(dats)
    axios.post(`${loginfo.url}:8000/users`, dats)
    .then(function (response) {
        //handle success
        classy.value = 'success'
        error_message.value = "Success!!!!";
        console.log(response);
    })
    .catch(function (response) {
        //handle error
        classy.value = 'error';
        error_message.value = response.response.data.detail;
        console.log(response);
    });
    console.log()
}
</script>

<style scoped>
.success {
    color:green
}
.error {
    color:red
}
</style>