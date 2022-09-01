import { defineStore } from "pinia";
import axios from 'axios';
export const useLoginStore = defineStore({
  id: "login",
  state: () => ({
    isLogged: false,
    name: '',
    token: ''
  }),
  getters: {
    logger: (state) => !state.isLogged,
  },
  actions: {
    log_user(name) {
      this.name = name;
      this.isLogged = true;
    },
    log_token(token) {
      this.token = token;
    },
    log_out() {
      this.name = '',
      this.token = '',
      this.isLogged = false;
    },
    //axios.p
  },
});
