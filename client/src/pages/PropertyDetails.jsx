import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../api/propertyApi";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data.property);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: "120px" }}>
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ paddingTop: "120px" }}>
        Property not found
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: "120px",
        maxWidth: "1400px",
        margin: "auto",
        paddingInline: "20px",
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
          height: "500px",
          objectFit: "cover",
          borderRadius: "24px",
        }}
      />

      <div style={{ marginTop: "40px" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
          }}
        >
          {property.title}
        </h1>

        <h2
          style={{
            color: "#2563eb",
            marginTop: "15px",
          }}
        >
          ₹{property.price?.toLocaleString()} / month
        </h2>

        <p
          style={{
            marginTop: "20px",
            color: "#64748b",
          }}
        >
          {property.address}, {property.city}
        </p>

        <hr />

        <h3>Description</h3>

        <p
          style={{
            marginTop: "15px",
            lineHeight: "1.8",
          }}
        >
          {property.description}
        </p>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "30px",
          }}
        >
          <div>
            <strong>Bedrooms:</strong>{" "}
            {property.bedrooms}
          </div>

          <div>
            <strong>Bathrooms:</strong>{" "}
            {property.bathrooms}
          </div>

          <div>
            <strong>Area:</strong>{" "}
            {property.area} sqft
          </div>
        </div>

        <button
          style={{
            marginTop: "40px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "14px",
            cursor: "pointer",
          }}
        >
          Contact Owner
        </button>
      </div>
    </div>
  );
}

export default PropertyDetails;