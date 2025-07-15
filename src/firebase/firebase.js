// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCqDaL9d5PurV0knxu0UAkGW3s41loUq8U",
  authDomain: "simulacion-6889f.firebaseapp.com",
  databaseURL: "https://simulacion-6889f-default-rtdb.firebaseio.com",
  projectId: "simulacion-6889f",
  storageBucket: "simulacion-6889f.appspot.com", 
  messagingSenderId: "12705526503",
  appId: "1:12705526503:web:28aaadbc722d73446fa842",
  measurementId: "G-60EHH4SP3M"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, database};
