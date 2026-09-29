import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration (read strictly from environment variables without prefixes)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App safely
let app = null;
let auth = null;
let db = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else if (getApps().length > 0) {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase initialization warning:", error?.message);
}

// Analytics exported as null to prevent unhandled background Installations network requests
const analytics = null;

export { app, auth, db, analytics, firebaseConfig };

