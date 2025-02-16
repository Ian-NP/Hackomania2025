import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCHF5AS5PhUvMGgqYHTpLGtaaBNHRniEt0",
    authDomain: "prodigi-e9dbf.firebaseapp.com",
    databaseURL: "https://prodigi-e9dbf-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "prodigi-e9dbf",
    storageBucket: "prodigi-e9dbf.firebasestorage.app",
    messagingSenderId: "113116816931",
    appId: "1:113116816931:web:f7e43fd35bcf76135cb396"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
