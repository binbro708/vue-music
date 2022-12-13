// 儲存user狀態

import { defineStore } from "pinia";
// 身分認證的儲存庫
export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
});
