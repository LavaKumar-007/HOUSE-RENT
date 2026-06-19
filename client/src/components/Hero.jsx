import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    propertyType: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.city) params.set("city", filters.city);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="container-xl hero-content">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Marvel your search
        </motion.p>

        <motion.h1
          className="display-title hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          Find a home that feels like yours
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Verified rentals across Hyderabad, Bengaluru, Chennai, Vijayawada,
          Vizag and more — with real listings, smart filters, and instant booking requests.
        </motion.p>

        <motion.form
          className="hero-search glass-card"
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <input
            className="form-control-custom"
            placeholder="Search city, area, or keyword..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <input
            className="form-control-custom"
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <select
            className="form-control-custom"
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          >
            <option value="">All Types</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Independent House</option>
            <option>Studio</option>
            <option>PG</option>
          </select>
          <button type="submit" className="btn-primary-custom">
            Search Properties
          </button>
        </motion.form>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(15,23,42,0.82), rgba(29,78,216,0.45)),
            url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000') center/cover;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          color: #fff;
          padding-top: 100px;
          padding-bottom: 80px;
        }
        .hero-title {
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          max-width: 900px;
          margin: 16px 0 24px;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          max-width: 640px;
          line-height: 1.7;
          opacity: 0.92;
          margin-bottom: 40px;
        }
        .hero-search {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 14px;
          padding: 20px;
          max-width: 1000px;
        }
        @media (max-width: 900px) {
          .hero-search {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
