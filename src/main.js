import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 匯入表單驗證設定
import VeeValidatePlugin from "@/includes/validation";
// 匯入firebase身分驗證的功能
import { auth } from "@/includes/firebase";
//匯入Icon
import Icon from "@/directives/icon.js";

import { registerSW } from "virtual:pwa-register";
// 匯入讀取條
import progressBar from "@/includes/progress-bar";

import "@/assets/base.css";
import "@/assets/main.css";
import "nprogress/nprogress.css";
// 把router傳進去
progressBar(router);

registerSW({ immediate: true });

let app;

auth.onAuthStateChanged(() => {
  // 如果 Vue 應用程式已經初始化過，則不再重新初始化
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    // 使用表單驗證
    app.use(VeeValidatePlugin);
    // 註冊自訂V指令
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
