// firebase 設定
// 匯入firebase sdk核心
import firebase from "firebase/app";
// 匯入firebase身分驗證服務
import "firebase/auth";
// 匯入firebase資料庫服務
import "firebase/firestore";
// 匯入firebase儲存庫服務
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcDquBsHUWVzPVfqN7gWC4jyU0i8SzL1Y",
  authDomain: "music-89314.firebaseapp.com",
  projectId: "music-89314",
  storageBucket: "music-89314.appspot.com",
  appId: "1:687434105612:web:a736bcd07c82fe581c7f29",
};
// 初始化firebase
firebase.initializeApp(firebaseConfig);
// 將使用命名導出 而不是導出預設對象

// 創建帳戶
const auth = firebase.auth();
// 操作資料庫
const db = firebase.firestore();
// 儲存庫
const storage = firebase.storage();

// 在資料庫選擇 如果沒有也沒關係firebase會自動幫你創建
const userCollection = db.collection("users");

// 再把方法匯出，就能在別的地方使用這些方法，可以提高code的閱讀性
export { auth, db, userCollection, storage };
