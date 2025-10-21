// Firebase Configuration Example
// Copy this to src/firebase.ts and replace with your actual values
//
// HOW TO GET THESE VALUES:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project
// 3. Go to Project Settings > General > Your apps
// 4. Click the "</>" icon to add a web app
// 5. Copy the config object below
//
// IMPORTANT: Also add these as Environment Variables in Vercel:
// - VITE_FIREBASE_API_KEY
// - VITE_FIREBASE_AUTH_DOMAIN
// - VITE_FIREBASE_PROJECT_ID
// - VITE_FIREBASE_STORAGE_BUCKET
// - VITE_FIREBASE_MESSAGING_SENDER_ID
// - VITE_FIREBASE_APP_ID

export const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};
