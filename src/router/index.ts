import { createRouter, createWebHistory } from "vue-router";
import GeneratorView from "../views/Generator.vue";

// console.log(`BASE_URL = ${import.meta.env.BASE_URL}`);

const router = createRouter({
  history: createWebHistory("/name-generator/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: GeneratorView,
    },
  ],
});

export default router;
