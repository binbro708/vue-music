import { defineStore } from "pinia";
// 身分認證的儲存庫
export default defineStore("modal", {
  state: () => ({
    // 是modal是否打開
    isOpen: false,
  }),
  getters: {
    // 傳入state
    hiddenClass(state) {
      // 如果state是false就hidden
      return !state.isOpen ? "hidden" : "";
    },
  },
});
