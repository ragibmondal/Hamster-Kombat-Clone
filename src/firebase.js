import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCcVnfwboER0CnB35alqFq0UtoVmYCUhh4",
  authDomain: "mytonix-a8dc6.firebaseapp.com",
  projectId: "mytonix-a8dc6",
  storageBucket: "mytonix-a8dc6.appspot.com",
  messagingSenderId: "944367304454",
  appId: "1:944367304454:web:b336e8fbbfdd749974a887",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
