import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence
  } from 'firebase/auth/react-native';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrcjFLbr7QJv9EpCnetOGExMmm5DDGvwo",
  authDomain: "rn-social-4efdd.firebaseapp.com",
  projectId: "rn-social-4efdd",
  storageBucket: "rn-social-4efdd.appspot.com",
  messagingSenderId: "370191367242",
  appId: "1:370191367242:web:de75461a1fcb13f62f3ab3",
  measurementId: "G-M6LT7R0WFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
export { auth };
  
export const db = getFirestore(app);
