import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

let currentUser: User | null = null;

// Initialize anonymous authentication
export const initializeAuth = () => {
  return new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
        console.log('User signed in:', user.uid);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed:', error);
        });
      }
      resolve();
    });
  });
};

// Generic function to load data from Firestore with localStorage fallback
export const loadData = async <T>(key: string, defaultValue: T): Promise<T> => {
  if (!currentUser) {
    // Fallback to localStorage if not authenticated
    const stored = localStorage.getItem(`sismac_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  try {
    const docRef = doc(db, 'users', currentUser.uid, 'data', key);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().value as T;
    } else {
      // If no data in Firestore, use default and save it
      await saveData(key, defaultValue);
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    // Fallback to localStorage
    const stored = localStorage.getItem(`sismac_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }
};

// Generic function to save data to Firestore with localStorage backup
export const saveData = async <T>(key: string, value: T): Promise<void> => {
  // Always save to localStorage as backup
  localStorage.setItem(`sismac_${key}`, JSON.stringify(value));

  if (!currentUser) return;

  try {
    const docRef = doc(db, 'users', currentUser.uid, 'data', key);
    await setDoc(docRef, { value, timestamp: new Date() });
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// Update specific data
export const updateData = async <T>(key: string, value: T): Promise<void> => {
  await saveData(key, value);
};