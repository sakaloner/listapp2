<template>
<h1 style="color:orangered">Log in to your account</h1>
<br>
<div>
    <p>Aqui probando cuanto se demora</p> 
    <p>Email</p><input v-model="email" placeholder="andy@gmail.com">
    <p>Password</p><input v-model="passw" placeholder="abc123"><br>
    <p :class="isError">{{ login_msg }}</p>
    <button @click="login">log in</button>
</div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import router from '../router';
import { useLoginStore } from '../stores/login';

const loginfo = useLoginStore();

const email = ref('');
const passw = ref('');

// error or success message
const login_msg = ref('');
// style error message
const isError = ref('notError');


function login() {
    console.log('cambiazo');
    console.log(loginfo.url);
    var bodyFormData = new FormData();
    bodyFormData.append('username', email.value);
    bodyFormData.append('password', passw.value);
    axios({
        method: 'post',
        url:`http://${loginfo.url}:8000/token`,
        data:bodyFormData,
        headers: { "Content-Type": "multipart/form-data",
                    "Access-Control-Allow-Origin": "*"}
        })
        .then(function (response) {
            console.log('funciono', response);
            isError.value = 'notError';
            login_msg.value = 'Sucess!!';
            console.log(login_msg.value);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
            // sending email username data to pinia store
            localStorage.setItem('token', response.data.access_token);
            loginfo.log_token(response.data.access_token);
            localStorage.setItem('username', response.data);
            
            setTimeout(get_user_name, 2000);
            setTimeout( () => {
                router.push('/')
            }, 2000);
             
            //return 1
        })
        .catch(function (response) {
            console.log('error login', response);
            isError.value = 'error';
            login_msg.value = response.response.data.detail;
            return 0
        });

};
function get_user_name() {
  console.log('url', loginfo.url);
  axios.get(`http://${loginfo.url}:8000/users/me`)
    .then(function (response) {
      console.log(response);
      loginfo.log_user(response.data.email);
      localStorage.setItem('username', response.data.email)
    })
    .catch(function (error) {
      console.log('error get_user_name ', error);
    });
};  
</script>

<style scoped>
.error {
    color:red
};
.notError {
    color:green
}
</style>
