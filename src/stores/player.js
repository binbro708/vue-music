import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

// 身分認證的儲存庫
export default defineStore("player", {
  state: () => ({
    // 儲存現在撥放音樂的資訊
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),
  //   取得現在撥放音樂的資訊
  actions: {
    async newSong(song) {
      // 判斷這個實例是否存在
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
      this.sound.play();
      this.sound.on("play", () => {
        // requestAnimationFrame() 方法接受一個參數，即將在瀏覽器動畫迴圈的下一個畫面上執行的回呼函數。回呼函數接受一個參數，表示當前時間的時間戳。
        requestAnimationFrame(this.progress);
      });
    },
    async toggleAudio() {
      // 確認是否有這首歌
      if (!this.sound.playing) {
        return;
      }
      // 確認是否這首歌有在播放
      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    progress() {
      // 回傳目前撥放位置
      this.seek = helper.formatTime(this.sound.seek());
      // 目前經過的持續時間
      this.duration = helper.formatTime(this.sound.duration());
      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;
      // 如果有再撥放狀態
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }
      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", this.progress);
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
});
