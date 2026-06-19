import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-xl footer-inner">
        <div>
          <h3 className="display-title" style={{ fontSize: "1.5rem" }}>HouseHunt</h3>
          <p>Your trusted rental marketplace across India.</p>
        </div>
        <div className="footer-links">
          <Link to="/properties">Properties</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-links">
          <Link to="/register">Sign Up</Link>
          <Link to="/login">Login</Link>
        </div>
        <p className="footer-copy">© 2026 HouseHunt. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
