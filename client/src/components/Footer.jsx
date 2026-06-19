function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-xl footer-inner">
        <div>
          <h3 className="display-title" style={{ fontSize: "1.5rem" }}>HouseHunt</h3>
          <p>Your trusted rental marketplace across India.</p>
        </div>
        <div className="footer-links">
          <a href="/properties">Properties</a>
          <a href="/about">About</a>
          <a href="/register">Sign Up</a>
        </div>
        <p className="footer-copy">© 2026 HouseHunt. All rights reserved.</p>
      </div>
      <style>{`
        .site-footer {
          background: var(--bg-dark);
          color: #cbd5e1;
          padding: 60px 0 30px;
          margin-top: 40px;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { color: #e2e8f0; font-weight: 600; }
        .footer-copy {
          grid-column: 1 / -1;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          font-size: 0.85rem;
        }
        @media (max-width: 600px) {
          .footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
