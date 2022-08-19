import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import SingUp from "../components/SignUp.vue";
import Login from "../components/LogIn.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainPage,
    },
    {
      path: "/signup",
      name: "Sign Up",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component:SingUp
    },
    {
      path: "/login",
      name: "Login",
      component: Login

    }
  ],
});

export default router;
