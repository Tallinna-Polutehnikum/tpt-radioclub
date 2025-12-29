/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { signIn, signOut, onAuthChange, getCurrentUser, setIdTokenCookie } from "../../auth/auth";
import type { User } from "firebase/auth";

type Props = {
    onAuthChange?: (user: User) => void;
    adminEmails?: string[];
};

const AdminLogin: React.FC<Props> = ({ onAuthChange: onAuthChangeProp, adminEmails = [] }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(getCurrentUser());

    useEffect(() => {
        const unsub = onAuthChange((u) => {
            setUser(u);
            if (onAuthChangeProp) onAuthChangeProp(u!);
        });
        return () => unsub();
    }, [onAuthChangeProp]);

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signIn(email.trim(), password);
            const token = await result.user.getIdToken();
            setIdTokenCookie(token);
        } catch (err: any) {
            setError(err?.message || "Sign in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    if (user) {
        const emailStr = user.email || "";
        const isAdmin = adminEmails.length ? adminEmails.includes(emailStr) : undefined;
        return (
            <div style={{ maxWidth: 520 }} className="page">
                <h3 className="page-title">Signed in</h3>
                <p>
                    Signed in as <strong>{emailStr}</strong>.
                    {typeof isAdmin === "boolean" && (
                        <span style={{ marginLeft: 8, color: isAdmin ? "green" : "crimson" }}>
                            {isAdmin ? "admin" : "not admin"}
                        </span>
                    )}
                </p>
                <div style={{ marginTop: 12 }}>
                    <button className="cta-outline" onClick={handleSignOut}>Sign out</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div style={{ maxWidth: 520 }}>
                <h3 className="page-title">Admin sign in</h3>

                <label style={{ display: "block", marginTop: 8,  marginBottom: 4 }}>Email</label>
                <input
                    className="admin-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="username"
                />

                <label style={{ display: "block", marginTop: 8, marginBottom: 4}}>Password</label>
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