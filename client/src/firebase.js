// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-estate-8f289.firebaseapp.com',
  projectId: 'mern-estate-8f289',
  storageBucket: 'mern-estate-8f289.appspot.com',
  messagingSenderId: '896698375081',
  appId: '1:896698375081:web:b9c159427ef1cceca542b8',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
