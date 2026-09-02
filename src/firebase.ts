// ── Firebase Configuration ────────────────────────────────────────────────────
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDyWZ9D6rGLw3N9Gt7_kDNO6ugsGDgRBiQ",
  authDomain: "pandarental-91d25.firebaseapp.com",
  projectId: "pandarental-91d25",
  storageBucket: "pandarental-91d25.firebasestorage.app",
  messagingSenderId: "1082458165098",
  appId: "1:1082458165098:web:09503dd433abb915f75f13",
  measurementId: "G-957MHGNG22",
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// ── Services ──────────────────────────────────────────────────────────────────

/** Firebase Authentication — Phone OTP, Google, etc. */
export const auth = getAuth(app)

/** Firestore Database — bookings, users, bikes */
export const db = getFirestore(app)

/** Cloud Storage — bike images, documents */
export const storage = getStorage(app)

/** Analytics */
export const analytics = getAnalytics(app)

export default app
