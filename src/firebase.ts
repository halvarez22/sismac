import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBpPP2uuwGtLqsWZXZYVH0AhjrT6upzM6I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sismac-6e1cb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sismac-6e1cb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sismac-6e1cb.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "384307836083",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:384307836083:web:d6c41cde99dddbcb35acc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
