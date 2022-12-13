import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import About from "@/views/AboutView.vue";
import Manage from "@/views/ManageView.vue";

const routes = [
  {
    // 可以設置name vueRouter的to可以link name畢竟你修改網址的時候總不可能一個一個改
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    // 別名
    // alias: "/mange",
    path: "/manage-music",
    component: Manage,
    // 只在mange防衛
    beforeEnter: (to, from, next) => {
      console.log("a");
      next();
    },
  },
  {
    path: "/manage",
    // 重新定向
    redirect: { name: "manage" },
  },
  // 取所有的路由來重新定位到首頁
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

// 全域防護
// router.beforeEach((to, form, next) => {
// next();
// });

export default router;
