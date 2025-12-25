import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Mic2, Radio } from "lucide-react";

const Header: React.FC = () => {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        "nav-btn" + (isActive ? " active" : "");

    return (
        <header className="site-header">
            <div className="header-inner">

                <div className="header-side left">
                    <Mic2 size={42} className="header-icon mic" />
                </div>

                <div className="header-center">
                    <NavLink to="/" className="brand-link">
                        <h1 className="brand-title">TPT RADIO CLUB</h1>
                        <p className="brand-sub">Shortwave from Tallinn</p>
                    </NavLink>

                    <nav className="main-nav" aria-label="Main navigation">
                        <NavLink to="/" end className={linkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/activities" className={linkClass}>
                            Activities
                        </NavLink>
                        <NavLink to="/about" className={linkClass}>
                            About
                        </NavLink>
                        <NavLink to="/schedule" className={linkClass}>
                            Schedule
                        </NavLink>
                        <NavLink to="/gallery" className={linkClass}>
                            Gallery
                        </NavLink>
                        <NavLink to="/callbook" className={linkClass}>
                            Callbook
                        </NavLink>
                        <Link to="/admin" className="nav-btn">Admin</Link>
                    </nav>
                </div>

                <div className="header-side right">
                    <Radio size={42} className="header-icon radio" />
                </div>
            </div>
        </header>
    );
};

export default Header;
