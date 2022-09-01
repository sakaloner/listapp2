import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from 'axios';

import App from "./App.vue";
import Router from "./router"
import "./assets/main.css";


var token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = 'bearer ' + token;
};

const app = createApp(App);

app.use(createPinia());
app.use(Router)

app.mount("#app");
