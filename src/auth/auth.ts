import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut as fbSignOut,
    onAuthStateChanged,
    type User,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

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

export function setIdTokenCookie(idToken: string, days = 1) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secureFlag = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `idToken=${encodeURIComponent(idToken)}; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;
}

export function clearIdTokenCookie() {
    document.cookie = `idToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

onAuthStateChanged(auth, async (user) => {
    try {
        if (user) {
            const token = await user.getIdToken();
            setIdTokenCookie(token, 1); // store 1 day
        } else {
            clearIdTokenCookie();
        }
    } catch (err) {
        console.warn("Failed to persist idToken to cookie:", err);
    }
});

export async function isIdTokenValid(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    try {
        const result = await user.getIdTokenResult(true);
        if (!result?.expirationTime) return false;
        const exp = new Date(result.expirationTime).getTime();
        return Date.now() < exp;
    } catch (err) {
        console.warn("isIdTokenValid error:", err);
        return false;
    }
}