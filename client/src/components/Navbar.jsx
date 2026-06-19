import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getNotifications, markAllNotificationsRead } from "../api/notificationApi";

function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getNotifications();
      setUnread(data.unreadCount);
      setNotifications(data.notifications);
    } catch {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      await markAllNotificationsRead();
      setUnread(0);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button className="notif-bell" onClick={handleOpen} aria-label="Notifications">
        <FaBell />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>
      {open && (
        <div className="glass-card" style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 320, maxHeight: 400, overflow: "auto", padding: 12, zIndex: 100 }}>
          {notifications.length === 0 ? (
            <p style={{ padding: 12, color: "var(--text-muted)" }}>No notifications</p>
          ) : (
            notifications.slice(0, 8).map((n) => (
              <div key={n._id} style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", cursor: "pointer" }} onClick={() => { navigate(n.link || "/dashboard"); setOpen(false); }}>
                <strong style={{ fontSize: "0.9rem" }}>{n.title}</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`navbar-custom ${shrunk ? "shrunk" : ""}`}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="container-xl navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">H</span>
          <span>HouseHunt</span>
        </Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span />
        </button>
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={isActive("/")} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/properties" className={isActive("/properties")} onClick={() => setMenuOpen(false)}>Properties</Link>
          <Link to="/about" className={isActive("/about")} onClick={() => setMenuOpen(false)}>About</Link>
          {user ? (
            <>
              {user.role === "tenant" && <Link to="/favorites" className={isActive("/favorites")} onClick={() => setMenuOpen(false)}>Saved</Link>}
              <Link to="/dashboard" className={isActive("/dashboard")} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" className={isActive("/profile")} onClick={() => setMenuOpen(false)}>Profile</Link>
              {(user.role === "owner" || user.role === "admin") && (
                <Link to="/add-property" onClick={() => setMenuOpen(false)}>List Property</Link>
              )}
              <NotificationBell />
              <button className="btn-outline-custom nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary-custom" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
