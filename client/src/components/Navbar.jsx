import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="navbar-custom"
    >
      <div className="container-xl navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">H</span>
          <span>HouseHunt</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/properties" onClick={() => setMenuOpen(false)}>Properties</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {(user.role === "owner" || user.role === "admin") && (
                <Link to="/add-property" onClick={() => setMenuOpen(false)}>List Property</Link>
              )}
              <button className="btn-outline-custom nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary-custom">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar-custom {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(247, 245, 242, 0.88);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 18px;
          padding-bottom: 18px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1.25rem;
        }
        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: var(--primary);
          color: #fff;
          display: grid;
          place-items: center;
          font-family: var(--font-display);
          font-size: 1.3rem;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .navbar-links a {
          font-weight: 600;
          color: var(--text);
          transition: color 0.2s;
        }
        .navbar-links a:hover { color: var(--primary); }
        .nav-btn { font-size: 0.9rem; }
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .menu-toggle span {
          width: 26px;
          height: 2px;
          background: var(--text);
        }
        @media (max-width: 900px) {
          .menu-toggle { display: flex; }
          .navbar-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            flex-direction: column;
            padding: 24px;
            gap: 18px;
            border-bottom: 1px solid var(--border);
            transform: translateY(-10px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.25s ease;
          }
          .navbar-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }
        }
      `}</style>
    </motion.nav>
  );
}

export default Navbar;
