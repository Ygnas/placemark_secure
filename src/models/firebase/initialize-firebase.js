// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase  } from "firebase/database";
import dotenv from "dotenv";

dotenv.config();


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
  databaseURL: process.env.databaseURL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
