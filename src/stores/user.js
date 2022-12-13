// 儲存user狀態

import { defineStore } from "pinia";

// 導入之前寫的firebase
import { auth, userCollection } from "@/includes/firebase";

// 身分認證的儲存庫
export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  //   可以定義函數
  actions: {
    // 不用箭頭函式，這邊可以用this操作
    async register(values) {
      // 傳入values的email跟password去創建帳戶
      await auth.createUserWithEmailAndPassword(values.email, values.password);
      // 請求加入資料庫
      //把資料加到users裡
      // 不用把密碼給加入，這是敏感訊息不該被儲存
      // 一樣使用await 上面要創建成功下面才會動
      await userCollection.add({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      // 更改登入狀態
      this.userLoggedIn = true;
    },
  },
});
