import { defineStore } from "pinia";
// 身分認證的儲存庫
export default defineStore("modal", {
  state: () => ({
    isOpen: false,
  }),
});
