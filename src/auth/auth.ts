import { supabase } from "../connection/supabase";
import type { User } from "@supabase/supabase-js";

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const onAuthChange = (cb: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ?? null);
  });
};

export const getCurrentUser = (): User | null => {
    supabase.auth.getSession().then(({ data }) => {
        return data.session?.user ?? null;
    });
    return null;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentUserAsync = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user ?? null;
};

export const getAccessToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.access_token ?? null;
};

export function setIdTokenCookie(token: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `access_token=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;
}

export function clearIdTokenCookie() {
  document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export async function isIdTokenValid(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session) return false;

    const expiresAt = session.expires_at;
    if (!expiresAt) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < expiresAt;
  } catch (err) {
    console.warn("isIdTokenValid error:", err);
    return false;
  }
}

supabase.auth.onAuthStateChange(async (_event, session) => {
  try {
    if (session?.access_token) {
      const expiresAt = session.expires_at;
      let days = 1;
      if (expiresAt) {
        const secondsLeft = expiresAt - Math.floor(Date.now() / 1000);
        days = Math.max(1, Math.floor(secondsLeft / 86400));
      }
      setIdTokenCookie(session.access_token, days);
    } else {
      clearIdTokenCookie();
    }
  } catch (err) {
    console.warn("Failed to persist token to cookie:", err);
  }
});
