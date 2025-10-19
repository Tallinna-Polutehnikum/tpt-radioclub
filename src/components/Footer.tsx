import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div>© {new Date().getFullYear()} TPT Radio Club — Tallinn</div>
                ES2OA, I did it for teh lulz!
            </div>
        </footer>
    );
};

export default Footer;
