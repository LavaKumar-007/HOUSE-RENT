import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/property/${property._id}`)
      }
      style={{
        background: "#fff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow:
          "0 20px 40px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "280px",
          overflow: "hidden",
        }}
      >
        <img
          src={
            property.images?.[0] ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
          }
          alt={property.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaHeart />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "600",
          }}
        >
          ₹{property.price?.toLocaleString()}/month
        </div>
      </div>

      <div
        style={{
          padding: "24px",
        }}
      >
        <h3
          style={{
            marginBottom: "10px",
            fontSize: "1.4rem",
            fontWeight: "700",
          }}
        >
          {property.title}
        </h3>

        <p
          style={{
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          <FaMapMarkerAlt /> {property.city}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#334155",
          }}
        >
          <span>
            <FaBed /> {property.bedrooms}
          </span>

          <span>
            <FaBath /> {property.bathrooms}
          </span>

          <span>{property.area} sqft</span>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;