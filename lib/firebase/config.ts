/**
 * FIREBASE CONFIGURATION
 *
 * This file initializes Firebase for the application.
 * Firebase is used for authentication and potentially other services (storage, realtime database).
 *
 * Key Concepts:
 * - Firebase: Google's backend-as-a-service platform (authentication, storage, database)
 * - Singleton pattern: Ensures only one Firebase instance is created
 * - Environment variables: API keys stored securely in .env.local (prefixed with NEXT_PUBLIC_ for client-side access)
 *
 * Important Note:
 * NEXT_PUBLIC_ prefix makes these variables available in the browser.
 * This is safe for Firebase config as these values are not secret (they identify your project).
 * The actual security comes from Firebase Security Rules.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * FIREBASE PROJECT CONFIGURATION
 *
 * Configuration object containing Firebase project credentials.
 * These values come from Firebase Console > Project Settings > General.
 *
 * Properties:
 * - apiKey: Public API key for Firebase services
 * - authDomain: Domain for Firebase Authentication
 * - projectId: Unique identifier for your Firebase project
 * - storageBucket: Cloud Storage bucket for file uploads
 * - messagingSenderId: For Firebase Cloud Messaging (push notifications)
 * - appId: App identifier from Firebase
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * INITIALIZE FIREBASE APP (SINGLETON PATTERN)
 *
 * Creates a single Firebase app instance for the entire application.
 *
 * Why we check getApps().length:
 * - In Next.js, hot-reload can cause this file to run multiple times
 * - Firebase throws an error if you try to initialize the same app twice
 * - We check if an app already exists before creating a new one
 *
 * Logic:
 * - If no apps exist (getApps().length === 0): Initialize new Firebase app
 * - If app already exists: Reuse the existing app (getApps()[0])
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * FIREBASE AUTHENTICATION INSTANCE
 *
 * Creates an authentication instance tied to the Firebase app.
 * This is used to handle user sign-in, sign-out, and authentication state.
 *
 * Usage:
 * - Import { auth } in components to check login status
 * - Use with Firebase Auth methods (signInWithPopup, signOut, etc.)
 */
const auth = getAuth(app);

// Export Firebase app and auth instances for use throughout the application
export { app, auth };
