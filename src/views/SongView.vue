<!-- 單個歌曲頁面 -->
<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <!-- 這邊傳出去的song是在created生命週期時所抓到的 -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">
            {{ song.modified_name }}
          </div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">評論 ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 md-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userLoggedIn"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment"></ErrorMessage>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import { mapState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Song",
  data() {
    return {
      song: {},
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "評論發布中",
      comments: [],
      //   時間排列模式 1是新到舊
      sort: "1",
    };
  },
  async beforeRouteEnter(to, from, next) {
    // 把要查詢的值直接用route的id
    const docSnapshot = await songsCollection.doc(to.params.id).get();
    next((vm) => {
      // 確保歌曲無效時不會載入頁面
      //exists 用來檢測是否有返回，沒東西就回重新導向回home
      if (!docSnapshot.exists) {
        vm.$router.push({ name: "home" });
        return;
      }

      // 取得route的查詢變數(query)下的sort
      const { sort } = vm.$route.query;

      // 如果sort裡面是1或2的時候就會是那個排序，如果沒有就代表還沒被排序過，就會是預設值
      vm.sort = sort === "1" || sort === "2" ? sort : "1";

      vm.song = docSnapshot.data();
      vm.getComments();
    });
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          // 從日期字串轉換為日期物件
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    // 加入評論
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_message = "評論發布中";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);
      //   評論有成功被加入 評論數+1
      this.song.comment_count += 1;
      //   請求更新數據
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      });
      //   添加新評論時重新請求評論列表
      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_message = "成功發布評論";
      resetForm();
    },
    // 取得評論
    async getComments() {
      // 用where sid是剛剛儲存的歌曲id
      const snapshot = await commentsCollection
        .where("sid", "==", this.$route.params.id)
        .get();
      // 先初始化
      this.comments = [];
      snapshot.forEach((item) => {
        this.comments.push({ docID: item.id, ...item.data() });
      });
    },
  },
  watch: {
    // 監控sort的變化
    // 這意味着如果sort屬性的值改變，那麼URL中的查詢參數也會改變。
    // 如果newVal已經有過了url就不用再新增sort
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
