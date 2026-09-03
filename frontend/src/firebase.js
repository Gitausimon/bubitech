import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDjxyMSHLNOd574gVi0wA8I-2E6Yo9F67o",
  authDomain: "bubitech-939ae.firebaseapp.com",
  projectId: "bubitech-939ae",
  storageBucket: "bubitech-939ae.firebasestorage.app",
  messagingSenderId: "111662620907",
  appId: "1:111662620907:web:3c997525a68593014edeae",
  measurementId: "G-VSM0VYEEFE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
