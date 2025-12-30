import type { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    error: string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};
