import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDUSMeoX9LfDTKIiesiOmJpy-Y06iZkZaM",
  authDomain: "scrum-board-bdcae.firebaseapp.com",
  projectId: "scrum-board-bdcae",
  storageBucket: "scrum-board-bdcae.firebasestorage.app",
  messagingSenderId: "379149038938",
  appId: "1:379149038938:web:0a4f0f2e8929f01af7af63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };