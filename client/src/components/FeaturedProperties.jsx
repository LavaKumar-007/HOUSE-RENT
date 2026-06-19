import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { getProperties } from "../api/propertyApi";

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        if (data.success) {
          setProperties(data.properties.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <section className="featured-section">
      <div className="container-xl">
        <div className="featured-header">
          <div>
            <p className="section-label">Curated for you</p>
            <h2 className="display-title">Featured properties</h2>
          </div>
          <Link to="/properties" className="btn-outline-custom">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="page-loader"><div className="loader-ring" /></div>
        ) : (
          <div className="properties-grid">
            {properties.map((property, i) => (
              <PropertyCard key={property._id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .featured-section {
          padding: 100px 0;
          background: var(--bg);
        }
        .featured-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .featured-header h2 { font-size: clamp(2rem, 4vw, 3rem); margin-top: 8px; }
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
        }
      `}</style>
    </section>
  );
}

export default FeaturedProperties;
