import React from "react";
import {
    Routes,
    Route,
    NavLink,
    Navigate,
    useNavigate,
} from "react-router-dom";
import ActivitiesEditor from "./components/ActivitiesEditor";
import CallsignManager from "./components/CallsignManager";
import GalleryEditor from "./components/GalleryEditor";
import "../styles/admin.css";
import { useAuth } from "../auth/AuthContext";
import { signOut } from "../auth/auth";
import QslBoardEditor from "./components/QslBoardEditor";

const AdminHome: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Sign out error:", err);
            alert("Failed to sign out");
        }
    };

    return (
        <div className="page">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 32,
                }}
            >
                <h1 className="page-title">Dashboard</h1>
                <button className="cta-outline" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20,
                }}
            >
                <div
                    style={{
                        padding: 20,
                        background: "var(--panel)",
                        borderRadius: 12,
                    }}
                >
                    <h3>Signed in as</h3>
                    <p
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            margin: "8px 0",
                        }}
                    >
                        {user?.email}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                        Admin account
                    </p>
                </div>

                <div
                    style={{
                        padding: 20,
                        background: "var(--panel)",
                        borderRadius: 12,
                    }}
                >
                    <h3>Help</h3>
                    <p
                        style={{
                            fontSize: 14,
                            color: "var(--muted)",
                            margin: 0,
                        }}
                    >
                        Need help? Check the documentation or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
};

const AdminApp: React.FC = () => {
    return (
        <div className="admin-layout page">
            <aside className="admin-sidebar">
                <div className="admin-logo">TPT Admin</div>
                <nav className="admin-nav" aria-label="Admin navigation">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive ? "admin-link active" : "admin-link"
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/activities"
                        className={({ isActive }) =>
                            isActive ? "admin-link active" : "admin-link"
                        }
                    >
                        Activities
                    </NavLink>
                    <NavLink
                        to="/admin/callsigns"
                        className={({ isActive }) =>
                            isActive ? "admin-link active" : "admin-link"
                        }
                    >
                        Callsigns
                    </NavLink>
                    <NavLink
                        to="/admin/gallery"
                        className={({ isActive }) =>
                            isActive ? "admin-link active" : "admin-link"
                        }
                    >
                        Gallery
                    </NavLink>
                     <NavLink
                        to="/admin/qsl-board"
                        className={({ isActive }) =>
                            isActive ? "admin-link active" : "admin-link"
                        }
                    >
                        QSL Board
                    </NavLink>
                </nav>
            </aside>

            <section className="admin-content">
                <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="activities" element={<ActivitiesEditor />} />
                    <Route path="callsigns" element={<CallsignManager />} />
                    <Route path="gallery" element={<GalleryEditor />} />
                    <Route path="qsl-board" element={<QslBoardEditor />} />

                    <Route
                        path="*"
                        element={<Navigate to="/admin" replace />}
                    />
                </Routes>
            </section>
        </div>
    );
};

export default AdminApp;
