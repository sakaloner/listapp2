<template>
<h1 style="color:orangered">Log in to your account</h1>
<br>
<div>
    <p>Email</p><input v-model="email" placeholder="andy@gmail.com">
    <p>Password</p><input v-model="passw" placeholder="abc123"><br>
    <p :class="isError">{{ login_msg }}</p>
    <button @click="login">log in</button>
</div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';

const email = ref('');
const passw = ref('');

// error or success message
const login_msg = ref('');
// style error message
const isError = ref('notError');

function login() {
    var bodyFormData = new FormData();
    bodyFormData.append('username', email.value);
    bodyFormData.append('password', passw.value);
    axios({
        method: 'post',
        url:'http://localhost:8000/token',
        data:bodyFormData,
        headers: { "Content-Type": "multipart/form-data"}
        })
        .then(function (response) {
            console.log(response);
            isError.value = 'notError';
            login_msg.value = 'Sucess!!';
            console.log(login_msg.value)
            return 1
        })
        .catch(function (response) {
            console.log(response);
            isError.value = 'error';
            login_msg.value = response.response.data.detail;
            return 0
        });

}  
</script>

<style scoped>
.error {
    color:red
};
.notError {
    color:green
}
</style>
