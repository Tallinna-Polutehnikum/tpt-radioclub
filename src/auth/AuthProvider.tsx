/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { onAuthChange, getCurrentUserAsync } from "./auth";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initUser = async () => {
      try {
        const currentUser = await getCurrentUserAsync();
        if (mounted) {
          setUser(currentUser);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Failed to load user");
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initUser();

    const isTokenValid = (): void => {
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.replace('access_token=', '');

      if (!accessToken) {
        return setTokenValid(false);
      }

      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        setTokenValid(now < payload.exp);
      } catch (err) {
        console.warn("isTokenValid error:", err);
        setTokenValid(false);
      }
    }

    isTokenValid();

    const { data } = onAuthChange((u) => {
      if (mounted) {
        setUser(u);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isTokenValid: tokenValid
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
