import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import About from "@/views/AboutView.vue";
import Manage from "@/views/ManageView.vue";
// 因為動態router的關係要載入元件
import Song from "@/views/SongView.vue";
import useUserStore from "@/stores/user";
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
      next();
    },
    // 如果一個一個檢查$route 在小網頁沒差，可是你路由一多就不太好管理
    mete: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    // 重新定向
    redirect: { name: "manage" },
  },
  {
    name: "song",
    // 動態路由設置
    path: "/song/:id",
    component: Song,
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
router.beforeEach((to, form, next) => {
  // 如果沒有這個值代表不需要身分驗證
  // 先判斷是否進入需要驗證的頁面
  if (!to.meta.requiresAuth) {
    next();
    return;
  }
  const store = useUserStore();
  // 接著判斷需要驗證的頁面登入了沒
  if (store.userLoggedIn) {
    next();
  } else {
    // 如果沒登入就引導回首頁
    next({ name: "home" });
  }
});

export default router;
