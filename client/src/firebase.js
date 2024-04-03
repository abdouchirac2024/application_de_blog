// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "application-de-blog.firebaseapp.com",
  projectId: "application-de-blog",
  storageBucket: "application-de-blog.appspot.com",
  messagingSenderId: "1044419732055",
  appId: "1:1044419732055:web:a5e70580ebba925d447912"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);