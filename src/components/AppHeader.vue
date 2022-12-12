<!--header元件  -->
<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <!-- 如果是登入狀態這邊就會消失，狀態控制用的是store裡的isOpen -->
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <li>
            <a class="px-2 text-white" href="#">Manage</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
// 能使用pinia的mapStores
import { mapStores } from "pinia";
// 導入你的store
import useModalStore from "@/stores/modal";
export default {
  name: "AppHeader",
  //   載進modalStore裡的modal
  // 第一個參數 要帶入的store，第二個參數要帶入的State或Getter，第二個沒填就是整個都帶進來
  computed: { ...mapStores(useModalStore) },
  // 變更isOpen的值
  methods: {
    toggleAuthModal() {
      // 這邊的modalStore會是modal.js裡的modal加上Store 是自動創建出來的，可以看vue開發者工具
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
  },
};
</script>
