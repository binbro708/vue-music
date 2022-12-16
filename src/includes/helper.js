export default {
  // 格式化時間
  //   如果 time 為 0 或負數則賦值為 0。
  formatTime(time) {
    const min = Math.floor(time / 60) || 0;
    // 計算剩餘的秒數
    const sec = Math.round(time - min * 60 || 0);
    // 想要在個位數時顯示0 像這樣 5:01
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  },
};
