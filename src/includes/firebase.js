// firebase 設定
// 匯入firebase sdk核心
import firebase from "firebase/app";
// 匯入firebase身分驗證服務
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcDquBsHUWVzPVfqN7gWC4jyU0i8SzL1Y",
  authDomain: "music-89314.firebaseapp.com",
  projectId: "music-89314",
  storageBucket: "music-89314.appspot.com",
  appId: "1:687434105612:web:a736bcd07c82fe581c7f29",
};
// 初始化firebase並且匯出

export default firebase.initializeApp(firebaseConfig);
