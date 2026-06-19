import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { getProperties } from "../api/propertyApi";

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  });

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "")
      );
      const data = await getProperties(cleanParams);
      if (data.success) setProperties(data.properties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      propertyType: searchParams.get("propertyType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
    };
    setFilters(params);
    fetchData(params);
  }, [searchParams]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  return (
    <div className="page-section">
      <div className="container-xl">
        <p className="section-label">Browse</p>
        <h1 className="display-title" style={{ fontSize: "3rem", marginBottom: "32px" }}>
          All properties
        </h1>

        <form className="filter-panel glass-card" onSubmit={handleFilter}>
          <input
            className="form-control-custom"
            placeholder="Search..."
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
          <input
            className="form-control-custom"
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            className="form-control-custom"
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <select
            className="form-control-custom"
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
          >
            <option value="">Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          <button type="submit" className="btn-primary-custom">Apply Filters</button>
        </form>

        <p style={{ margin: "24px 0", color: "var(--text-muted)" }}>
          {properties.length} properties found
        </p>

        {loading ? (
          <div className="page-loader"><div className="loader-ring" /></div>
        ) : (
          <div className="properties-grid">
            {properties.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          padding: 24px;
          margin-bottom: 12px;
        }
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
        }
      `}</style>
    </div>
  );
}

export default Properties;
