// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMZugHbmA3vX73g2lZaJ2AZ7Uvqelr5BQ",
    authDomain: "nextjs-flashcards-226b6.firebaseapp.com",
    projectId: "nextjs-flashcards-226b6",
    storageBucket: "nextjs-flashcards-226b6.firebasestorage.app",
    messagingSenderId: "1035267442187",
    appId: "1:1035267442187:web:6af16b8b4302c68ebba90e",
    measurementId: "G-K3HHQHF267"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);