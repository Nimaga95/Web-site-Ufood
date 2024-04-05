import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/Home";
import Restaurant from "@/pages/Restaurant.vue";
import User from "@/pages/User.vue";
import Login from "@/pages/Login.vue";
import * as session from "@/api/session";

const routes = [
  {
    path: "/:query?",
    name: "Home",
    component: Home
  },
  {
    path: "/restaurant/:id",
    name: "Restaurant",
    component: Restaurant
  },
  {
    path: "/user/:id?",
    name: "User",
    component: User
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !await session.validLogin() &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login'
  ) {
    // redirect the user to the login page
    return { name: 'Login' }
  }
})
