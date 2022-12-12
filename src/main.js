import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 匯入表單驗證
import VeeValidatePlugin from "@/includes/validation";
import "@/assets/base.css";
import "@/assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
// 使用表單驗證
app.use(VeeValidatePlugin);
app.mount("#app");
