/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { signIn, onAuthChange, getCurrentUser, setIdTokenCookie } from "../../auth/auth";
import type { User } from "@supabase/supabase-js";
import { Navigate } from "react-router";

type Props = {
    onAuthChange?: (user: User) => void;
    adminEmails?: string[];
};

const AdminLogin: React.FC<Props> = ({ onAuthChange: onAuthChangeProp }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(getCurrentUser());

    useEffect(() => {
        const sub = onAuthChange((u) => {
            setUser(u);
            if (onAuthChangeProp) onAuthChangeProp(u!);
        });
        return () => {
            const anySub = sub as any;
            if (anySub && anySub.data && anySub.data.subscription && typeof anySub.data.subscription.unsubscribe === "function") {
                anySub.data.subscription.unsubscribe();
            }
        };
    }, [onAuthChangeProp]);

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signIn(email.trim(), password);
            const token = result.session?.access_token ?? '';
            setIdTokenCookie(token);
        } catch (err: any) {
            setError(err?.message || "Sign in failed");
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="page">
            <div style={{ maxWidth: 520 }}>
                <h3 className="page-title">Admin sign in</h3>

                <label style={{ display: "block", marginTop: 8, marginBottom: 4 }}>Email</label>
                <input
                    className="admin-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="username"
                />

                <label style={{ display: "block", marginTop: 8, marginBottom: 4 }}>Password</label>
                <input
                    className="admin-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && email && password) handleSignIn();
                    }}
                />

                {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta" onClick={handleSignIn} disabled={loading || !email || !password}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                    <button
                        className="cta-outline"
                        onClick={() => {
                            setEmail("");
                            setPassword("");
                            setError(null);
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;