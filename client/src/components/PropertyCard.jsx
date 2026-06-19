import { FaBed, FaBath, FaMapMarkerAlt, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function PropertyCard({ property, index = 0 }) {
  const navigate = useNavigate();
  const { user, updateFavorites } = useAuth();
  const favorited = user?.favorites?.some(
    (id) => (id._id || id).toString() === property._id
  );

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    try { await updateFavorites(property._id); } catch (err) { console.error(err); }
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
          loading="lazy"
          src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"}
          alt={property.title}
        />
        <button className={`favorite-btn ${favorited ? "active" : ""}`} onClick={handleFavorite} aria-label="Toggle favorite">
          <FaHeart />
        </button>
        <span className="price-tag">₹{property.price?.toLocaleString()}/mo</span>
      </div>
      <div className="property-body">
        <span className="property-type">{property.propertyType}</span>
        <h3>{property.title}</h3>
        <p className="location"><FaMapMarkerAlt /> {property.city}, {property.state}</p>
        {property.averageRating > 0 && (
          <p className="rating-badge"><FaStar /> {property.averageRating} ({property.reviewCount})</p>
        )}
        <div className="property-meta">
          <span><FaBed /> {property.bedrooms}</span>
          <span><FaBath /> {property.bathrooms}</span>
          <span>{property.area} sqft</span>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;
