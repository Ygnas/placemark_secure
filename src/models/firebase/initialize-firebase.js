// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase  } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG2-4szibvc-lp2XnHhky7vROWz31uKkg",
  authDomain: "placemark-42f0b.firebaseapp.com",
  projectId: "placemark-42f0b",
  storageBucket: "placemark-42f0b.appspot.com",
  messagingSenderId: "680559859028",
  appId: "1:680559859028:web:b9b0d5eab3f5944f4324c1",
  measurementId: "G-Z2YD7EYW7E",
  databaseURL: "https://placemark-42f0b-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
