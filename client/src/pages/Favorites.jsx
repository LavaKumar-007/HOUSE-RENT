import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites } from "../api/authApi";
import PropertyCard from "../components/PropertyCard";
import { SkeletonGrid } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import PageMeta from "../components/PageMeta";
import ProtectedRoute from "../components/ProtectedRoute";

function FavoritesContent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then((data) => setProperties(data.properties || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-section">
      <PageMeta title="Saved Homes" />
      <div className="container-xl">
        <p className="section-label">Your collection</p>
        <h1 className="display-title" style={{ fontSize: "3rem", marginBottom: 32 }}>Saved Homes</h1>
        {loading ? <SkeletonGrid /> : properties.length === 0 ? (
          <EmptyState
            title="No saved homes yet"
            message="Tap the heart on any property to save it here."
            action={<Link to="/properties" className="btn-primary-custom" style={{ display: "inline-block", marginTop: 16 }}>Browse Properties</Link>}
          />
        ) : (
          <div className="properties-grid">
            {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Favorites() {
  return <ProtectedRoute><FavoritesContent /></ProtectedRoute>;
}

export default Favorites;
