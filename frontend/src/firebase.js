import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "resourceflow-bce82.firebaseapp.com",
  projectId: "resourceflow-bce82",
  storageBucket: "resourceflow-bce82.firebasestorage.app",
  messagingSenderId: "501600387081",
  appId: "1:501600387081:web:eb106266a26812df24b8d8"
};

export const app = initializeApp(firebaseConfig);
