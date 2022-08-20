import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    beforeEnter: () => {
      let token = localStorage.getItem("token");
      if (token) {
        return true;
      }
      router.push("/");
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: () => {
      let token = localStorage.getItem("token");
      if (token) {
        return true;
      }
      router.push("/");
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
