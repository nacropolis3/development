import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdZ8hmAO9uxcCUkxwsz2fJgkOGJEyZ8ss",
  authDomain: "acropolis-dev-6dec9.firebaseapp.com",
  projectId: "acropolis-dev-6dec9",
  storageBucket: "acropolis-dev-6dec9.appspot.com",
  messagingSenderId: "656692497423",
  appId: "1:656692497423:web:e35198bf7b4cf46411277a",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
const db = getFirestore(app);
export { db };
