import { defineStore } from "pinia";
import { Howl } from "howler";
// 身分認證的儲存庫
export default defineStore("player", {
  state: () => ({
    // 儲存現在撥放音樂的資訊
    current_song: {},
    sound: {},
  }),
  //   取得現在撥放音樂的資訊
  actions: {
    async newSong(song) {
      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
      this.sound.play();
    },
  },
});
