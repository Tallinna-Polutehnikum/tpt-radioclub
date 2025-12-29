/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { onAuthChange, getCurrentUserAsync } from "./auth";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};