import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBo_QXtcbdLRXxJ6zZYuvwUn0AudhUrWek",
  authDomain: "news-dashboard-dee87.firebaseapp.com",
  projectId: "news-dashboard-dee87",
  storageBucket: "news-dashboard-dee87.firebasestorage.app",
  messagingSenderId: "1057875107766",
  appId: "1:1057875107766:web:f3a37c61864b75db056b17"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
