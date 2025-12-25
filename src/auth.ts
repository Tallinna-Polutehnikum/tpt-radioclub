import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUpRK8M60bw9eaDsQ_s-u-0jWbTv-eLO4",
  authDomain: "tpt-radio-club.firebaseapp.com",
  projectId: "tpt-radio-club",
  storageBucket: "tpt-radio-club.firebasestorage.app",
  messagingSenderId: "589790806384",
  appId: "1:589790806384:web:115d1b686ffed019a80fb5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// simple PoC API
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  return await fbSignOut(auth);
};

export const onAuthChange = (cb: (user: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};

export const getCurrentUser = () => auth.currentUser;