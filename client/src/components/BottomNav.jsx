import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaHeart, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  if (!user || user.role !== "tenant") return null;

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <div className="bottom-nav-inner">
        <Link to="/" className={isActive("/")}><FaHome /><span>Home</span></Link>
        <Link to="/properties" className={isActive("/properties")}><FaSearch /><span>Search</span></Link>
        <Link to="/favorites" className={isActive("/favorites")}><FaHeart /><span>Saved</span></Link>
        <Link to="/dashboard" className={isActive("/dashboard")}><FaUser /><span>Dashboard</span></Link>
      </div>
    </nav>
  );
}

export default BottomNav;
