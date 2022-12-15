<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <music-upload :addSong="addSong"></music-upload>
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import useUserStore from "@/stores/user";
import MusicUpload from "@/components/MusicUpload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { songsCollection, auth } from "@/includes/firebase";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "manage",
  data() {
    return {
      songs: [],
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   // 在route創建前先載入它的資訊
  //   const store = useUserStore();
  //   if (store.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: "home" });
  //   }
  // },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    // 刪除song列表裡的自己那筆
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(item) {
      // 我只要snapshot裡面的data跟id id是方便後面編輯或刪除
      console.log(item);
      const song = { ...item.data(), docID: item.id };
      this.songs.push(song);
    },
  },
  components: {
    MusicUpload,
    CompositionItem,
  },
  async created() {
    // created方法正在查找一個名為songsCollection的集合，並查找其中包含當前用戶的UID的文檔。
    // 就是回傳與用戶uid一樣的歌曲，因為上傳時有傳一個uid的值
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();
    snapshot.forEach(this.addSong);
  },
};
</script>
