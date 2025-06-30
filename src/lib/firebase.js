// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyD7ThgwKtJrHBzEqpjyCQHWmEzACGAbz00",
  authDomain: "tasksmanager-d46d4.firebaseapp.com",
  projectId: "tasksmanager-d46d4",
  storageBucket: "tasksmanager-d46d4.firebasestorage.app",
  messagingSenderId: "59957978021",
  appId: "1:59957978021:web:86cb85a64aae0ebd95be4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services
export { app, auth, db };