<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon.yellow.right="'headphones-alt'"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          ></song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from "@/includes/firebase";
import SongItem from "@/components/SongItem.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false,
    };
  },
  components: {
    SongItem,
  },
  async created() {
    // 一樣在created生命週期的時候取得資料
    this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  // 卸載元件前
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 因為要在使用者滾動到底部的時候，才渲染出新的歌曲，所以把取得歌曲清單的函式拉出來做
    // 可以使用limit來限制獲取的筆數
    async getSongs() {
      // 可能會連續觸發請求可能會造成不可控的錯誤，所以請求前先check上次的請求是否完成
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;
      let snapshots;
      // 如果是song還沒有東西時就去判斷最後一筆會有問題，所以加一個判斷的方法
      if (this.songs.length) {
        // 用來取得最後一筆，拿來判斷下一輪歌單的開頭從哪裡開始
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();
        console.log(lastDoc);
        // 整理一次筆數
        snapshots = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get();
      } else {
        // 如果沒有那就是一開始，所以會自己去取前三筆
        snapshots = await songsCollection
          .orderBy("modified_name")
          .limit(this.maxPerPage)
          .get();
      }

      // 把資料抓出來push到songs裡，拿來渲染
      snapshots.forEach((item) => {
        this.songs.push({
          docID: item.id,
          ...item.data(),
        });
      });
      this.pendingRequest = false;
    },
    handleScroll() {
      // 計算是否滾動到底部
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;
      // 滾動到底部就去獲得歌單
      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
};
</script>
