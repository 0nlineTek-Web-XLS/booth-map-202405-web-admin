import CRUD from "@/views/crud.vue";
import Home from "@/views/index.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/crud",
    component: CRUD,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
