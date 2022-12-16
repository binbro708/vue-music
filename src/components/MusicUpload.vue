<!-- 上傳元件的部分 -->
<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <!-- 監聽拖動事件 -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />

      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="item in uploads" :key="item.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="item.text_class">
          <i :class="item.icon"></i>
          {{ item.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="item.variant"
            :style="{ width: item.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";

export default {
  name: "musicUpload",
  data() {
    return {
      // 檔案拖動到dropbox的時候要改為true
      is_dragover: false,
      uploads: [],
    };
  },
  props: ["addSong"],
  methods: {
    // 東西drop放下的時候會觸發上傳函式
    upload($event) {
      this.is_dragover = false;

      //   $event裡的files要直接訪問才看的到，這邊把檔案內容轉成陣列來跑迴圈上傳
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];
      files.forEach((item) => {
        // 驗證檔案屬性
        if (item.type != "audio/mpeg") {
          return;
        }

        // 用於取得一個引用，方便後面的操作
        const storageRef = storage.ref(); //music-89314.appspot.com
        // 我要在storage下再創造另一個拿來存放的方便管理
        const songsRef = storageRef.child(`songs/${item.name}`); //music-89314.appspot.com/songs/example.mp3
        // 檔案上傳
        const task = songsRef.put(item);
        // 把值傳進去上傳狀態的陣列
        //這裡的 -1 是用來獲取陣列中新添加的項0.目的索引值。當一個項目添加到陣列中時，JavaScript 的 Array.push() 方法會返回陣列的新長度。由於陣列的索引從 0 開始計算，因此添加到陣列中的新項目的索引值會比陣列的長度少 1。
        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: item.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1;

        // 用於設置一個回調函數，在文件上傳任務的狀態發生改變時被調用。不管是有進展成功失敗都會
        task.on(
          "state_changed",
          (snapshot) => {
            // 上傳ing
            // 計算上傳百分比
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            // 上傳失敗
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].text_class = "text-red-400";
            console.log(error);
          },
          async () => {
            // 上傳成功
            const song = {
              // 紀錄上傳成功user的uid
              uid: auth.currentUser.uid,
              //  記錄使用者名稱
              display_name: auth.currentUser.displayName,
              // 紀錄歌曲上傳時的名字
              original_name: task.snapshot.ref.name,
              //   修改後的名字
              modified_name: task.snapshot.ref.name,
              genre: "",
              //   總共評論數
              comment_count: 0,
              //
            };

            song.url = await task.snapshot.ref.getDownloadURL();
            //把音樂資訊傳進資料庫
            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();

            this.addSong(songSnapshot);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].text_class = "text-green-400";
          }
        );
      });
    },
  },
  //   解除掛載前
  beforeUnmount() {
    this.uploads.forEach((item) => {
      // task.cancel停止向firebase上傳
      item.task.cancel();
    });
  },
};
</script>
