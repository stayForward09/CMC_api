import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-wfycx1JRZSDFlldihusXdRUI-tgY8lc",
  authDomain: "crypto-coins-73541.firebaseapp.com",
  projectId: "crypto-coins-73541",
  storageBucket: "crypto-coins-73541.appspot.com",
  messagingSenderId: "840371878588",
  appId: "1:840371878588:web:04a5c878347d18d9552eb9",
  measurementId: "G-2447L2JY2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
