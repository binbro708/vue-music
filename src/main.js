import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 匯入表單驗證設定
import VeeValidatePlugin from "@/includes/validation";
// 匯入firebase設定

import { auth } from "@/includes/firebase";

import "@/assets/base.css";
import "@/assets/main.css";

let app;

auth.onAuthStateChanged(() => {
  // 如果 Vue 應用程式已經初始化過，則不再重新初始化
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    // 使用表單驗證
    app.use(VeeValidatePlugin);
    app.mount("#app");
  }
});
