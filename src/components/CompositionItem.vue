<template>
  <!-- Composition Items -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div>
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <!-- 編輯歌曲表單 -->
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">標題</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="輸入標題"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">類別</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="輸入類別"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          送出
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          返回
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
  name: " CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      // 用來判斷是否點擊編輯，編輯表單才會展開
      showForm: false,
      // 驗證表單的規則
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      // 管理alert狀態
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "稍等片刻",
    };
  },
  methods: {
    // 編輯歌曲
    async edit(values) {
      // alert設定
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "稍等片刻";

      // 編輯請求
      try {
        // 「songsCollection.doc(this.song.docID)」是一段代碼，它會檢索 Firebase 資料庫中名為「songsCollection」的集合，並獲取文件 ID 為「this.song.docID」的文件。
        await songsCollection.doc(this.song.docID).update(values);
      } catch (err) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "請重新嘗試";
        return;
      }

      this.updateSong(this.index, values);

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "修改成功";
    },
    // 刪除歌曲
    async deleteSong() {
      // 取得資料庫
      const storageRef = storage.ref();
      // storage.ref() 用於獲取一個 Firebase Storage 的引用，然後通過調用 child() 方法來獲取一個指向特定路徑的引用，這個路徑就是 songs/${this.song.original_name}。
      const songRef = storageRef.child(`songs/${this.song.original_name}`);
      // 這邊刪除的是資料庫的，檔案庫裡的還沒刪除
      await songRef.delete();
      // 取得檔案庫的並且刪除
      await songsCollection.doc(this.song.docID).delete();

      this.removeSong(this.index);
    },
  },
};
</script>
