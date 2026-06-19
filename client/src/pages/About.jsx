import PageMeta from "../components/PageMeta";

function About() {
  return (
    <div className="page-section" id="main">
      <PageMeta title="About" description="Learn about HouseHunt rental platform" />
      <div className="container-xl about-grid">
        <div>
          <p className="section-label">Our story</p>
          <h1 className="display-title about-title">
            A smarter way to find your next home
          </h1>
          <p className="about-text">
            HouseHunt is a user-centric rental platform built to simplify how tenants,
            owners, and professionals engage with the real estate market. Browse verified
            listings, compare neighborhoods, and request bookings — all in one place.
          </p>
          <p className="about-text">
            With advanced search filters, detailed property data, and role-based dashboards,
            HouseHunt helps you make confident decisions faster. List your property in minutes,
            manage inquiries from your dashboard, and connect directly with interested renters.
          </p>
        </div>
        <div className="about-visual">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
            alt="Modern home interior"
          />
        </div>
      </div>

      <div className="container-xl features-row">
        {[
          { title: "Verified Listings", desc: "Real properties with detailed specs and photos." },
          { title: "Smart Search", desc: "Filter by city, price, type, and bedrooms instantly." },
          { title: "Direct Booking", desc: "Tenants request rentals; owners approve in one click." },
          { title: "24/7 Access", desc: "Browse and manage from any device, anytime." },
        ].map((f) => (
          <div key={f.title} className="feature-card glass-card">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 80px;
        }
        .about-title { font-size: clamp(2.2rem, 4vw, 3.5rem); margin: 12px 0 24px; }
        .about-text { color: var(--text-muted); line-height: 1.8; margin-bottom: 16px; }
        .about-visual img { border-radius: 24px; box-shadow: var(--shadow); }
        .features-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .feature-card { padding: 28px; }
        .feature-card h3 { margin-bottom: 10px; font-size: 1.2rem; }
        .feature-card p { color: var(--text-muted); line-height: 1.6; }
        @media (max-width: 800px) {
          .about-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default About;
