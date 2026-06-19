import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { getProperties } from "../api/propertyApi";
import { createSavedSearch } from "../api/savedSearchApi";
import { SkeletonGrid } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import PageMeta from "../components/PageMeta";
import { useAuth } from "../context/AuthContext";

function Properties() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "", city: "", propertyType: "", minPrice: "", maxPrice: "", bedrooms: "", sort: "-createdAt",
  });

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
      const data = await getProperties(clean);
      if (data.success) {
        setProperties(data.properties);
        setMeta({ total: data.total, page: data.page, pages: data.pages });
      }
    } catch {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      propertyType: searchParams.get("propertyType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      sort: searchParams.get("sort") || "-createdAt",
      page: searchParams.get("page") || "1",
    };
    setFilters(params);
    fetchData(params);
  }, [searchParams, fetchData]);

  const handleFilter = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, v); });
    p.set("page", "1");
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const activeChips = Object.entries(filters).filter(([k, v]) => v && k !== "sort" && k !== "page");

  const saveSearch = async () => {
    if (!user) return;
    const name = filters.city || filters.search || "My Search";
    await createSavedSearch({ name, filters });
    alert("Search saved!");
  };

  const changePage = (page) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", String(page));
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-section" id="main">
      <PageMeta title="Properties" description="Browse rental properties on HouseHunt" />
      <div className="container-xl">
        <p className="section-label">Browse</p>
        <h1 className="display-title" style={{ fontSize: "3rem", marginBottom: "32px" }}>All properties</h1>

        <div className="map-section">
          <iframe
            title="Property locations map"
            src="https://maps.google.com/maps?q=Hyderabad%20India&output=embed"
            loading="lazy"
          />
        </div>

        <form className="filter-panel glass-card" onSubmit={handleFilter}>
          <input className="form-control-custom" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <input className="form-control-custom" placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <select className="form-control-custom" value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
            <option value="">All Types</option>
            <option>Apartment</option><option>Villa</option><option>Independent House</option><option>Studio</option><option>PG</option>
          </select>
          <input className="form-control-custom" type="number" placeholder="Min price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <input className="form-control-custom" type="number" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          <select className="form-control-custom" value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}>
            <option value="">Bedrooms</option>
            <option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
          </select>
          <select className="form-control-custom" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low</option>
            <option value="-price">Price: High</option>
          </select>
          <button type="submit" className="btn-primary-custom">Apply</button>
        </form>

        {activeChips.length > 0 && (
          <div className="filter-chips">
            {activeChips.map(([k, v]) => (
              <span key={k} className="filter-chip">{k}: {v}</span>
            ))}
            <button className="btn-outline-custom" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={clearFilters}>Clear all</button>
            {user && <button className="btn-outline-custom" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={saveSearch}>Save search</button>}
          </div>
        )}

        <p style={{ margin: "24px 0", color: "var(--text-muted)" }}>{meta.total} properties found</p>
        {error && <div className="alert-custom alert-error">{error}</div>}

        {loading ? <SkeletonGrid /> : properties.length === 0 ? (
          <EmptyState title="No properties found" message="Try adjusting your filters." action={<button className="btn-primary-custom" onClick={clearFilters}>Clear filters</button>} />
        ) : (
          <>
            <div className="properties-grid">
              {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
            </div>
            {meta.pages > 1 && (
              <div className="pagination">
                <button disabled={meta.page <= 1} onClick={() => changePage(meta.page - 1)}>Prev</button>
                {Array.from({ length: meta.pages }, (_, i) => i + 1).slice(
                  Math.max(0, meta.page - 3),
                  meta.page + 2
                ).map((p) => (
                  <button key={p} className={p === meta.page ? "active" : ""} onClick={() => changePage(p)}>{p}</button>
                ))}
                <button disabled={meta.page >= meta.pages} onClick={() => changePage(meta.page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Properties;
