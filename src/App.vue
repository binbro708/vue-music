<template>
  <!-- Header -->
  <app-header></app-header>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <!-- Player -->
  <player></player>
  <!-- Auth Modal -->
  <app-auth></app-auth>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "@/components/AppAuth.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";
import Player from "@/components/MusicPlayer.vue";

export default {
  name: "App",
  components: { AppHeader, AppAuth, Player },
  computed: {
    // 取出userLoggedIn判斷是否登入
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  // 在生命週期created去判斷
  created() {
    // auth.currentUser，它代表當前登入應用程式的使用者 如果有登入就會有東西回傳的就會是true 如果沒登入就會是null
    // 檢查當前是否有使用者登入，如果有登入則更新 userLoggedIn 狀態
    if (auth.currentUser) {
      console.log(this.userLoggedIn);
      console.log(auth.currentUser.uid);
      console.log(auth.currentUser.displayName);
      this.userLoggedIn = true;
      console.log("create");
    }
  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
