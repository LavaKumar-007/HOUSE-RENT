import { FaBed, FaBath, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../api/authApi";
import { useState } from "react";

function PropertyCard({ property, index = 0 }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(
    user?.favorites?.includes(property._id)
  );

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await toggleFavorite(property._id);
      setFavorited(!favorited);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      className="property-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/property/${property._id}`)}
    >
      <div className="property-image-wrap">
        <img
          src={
            property.images?.[0] ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
          }
          alt={property.title}
        />
        <button
          className={`favorite-btn ${favorited ? "active" : ""}`}
          onClick={handleFavorite}
        >
          <FaHeart />
        </button>
        <span className="price-tag">
          ₹{property.price?.toLocaleString()}/mo
        </span>
      </div>

      <div className="property-body">
        <span className="property-type">{property.propertyType}</span>
        <h3>{property.title}</h3>
        <p className="location">
          <FaMapMarkerAlt /> {property.city}, {property.state}
        </p>
        <div className="property-meta">
          <span><FaBed /> {property.bedrooms} Beds</span>
          <span><FaBath /> {property.bathrooms} Baths</span>
          <span>{property.area} sqft</span>
        </div>
      </div>

      <style>{`
        .property-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: box-shadow 0.3s ease;
        }
        .property-card:hover { box-shadow: 0 32px 70px rgba(15,23,42,0.14); }
        .property-image-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
        }
        .property-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .property-card:hover img { transform: scale(1.06); }
        .favorite-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.92);
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #94a3b8;
          transition: all 0.2s;
        }
        .favorite-btn.active { color: #ef4444; }
        .price-tag {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: var(--primary);
          color: #fff;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .property-body { padding: 22px; }
        .property-type {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
        }
        .property-body h3 {
          font-size: 1.2rem;
          margin: 8px 0;
          font-weight: 700;
        }
        .location { color: var(--text-muted); margin-bottom: 16px; }
        .property-meta {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-size: 0.9rem;
        }
      `}</style>
    </motion.div>
  );
}

export default PropertyCard;
