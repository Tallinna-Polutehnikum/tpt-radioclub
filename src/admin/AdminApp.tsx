import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import ActivitiesEditor from "./components/ActivitiesEditor";
import CallsignManager from "./components/CallsignManager";
import GalleryEditor from "./components/GalleryEditor";
import "../styles/admin.css";

const AdminHome: React.FC = () => (
    <div className="admin-welcome page">
        <h2>Admin Panel</h2>
        <p>Welcome. Use the menu to manage content.</p>
    </div>
);

const AdminApp: React.FC = () => {
    return (
        <div className="admin-layout page">
            <aside className="admin-sidebar">
                <div className="admin-logo">TPT Admin</div>
                <nav className="admin-nav" aria-label="Admin navigation">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>Dashboard</NavLink>
                    <NavLink to="/admin/activities" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>Activities</NavLink>
                    <NavLink to="/admin/callsigns" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>Callsigns</NavLink>
                    <NavLink to="/admin/gallery" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>Gallery</NavLink>
                </nav>
            </aside>

            <section className="admin-content">
                <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="activities" element={<ActivitiesEditor />} />
                    <Route path="callsigns" element={<CallsignManager />} />
                    <Route path="gallery" element={<GalleryEditor />} />

                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </section>
        </div>
    );
};

export default AdminApp;