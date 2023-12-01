import { createRouter, createWebHistory } from "vue-router";
import GeneratorView from "../views/Generator.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: GeneratorView,
    },
  ],
});

export default router;
