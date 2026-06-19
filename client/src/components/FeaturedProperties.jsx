import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { getProperties } from "../api/propertyApi";
import { SkeletonGrid } from "./ui/Skeleton";

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties({ limit: 6 })
      .then((data) => { if (data.success) setProperties(data.properties); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured-section">
      <div className="container-xl">
        <div className="featured-header">
          <div>
            <p className="section-label">Curated for you</p>
            <h2 className="display-title">Featured properties</h2>
          </div>
          <Link to="/properties" className="btn-outline-custom">View all</Link>
        </div>
        {loading ? <SkeletonGrid count={6} /> : (
          <div className="properties-grid">
            {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
