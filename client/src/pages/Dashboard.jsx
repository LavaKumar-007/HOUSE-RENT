import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProperties, deleteProperty, getAdminStats, getAllPropertiesAdmin } from "../api/propertyApi";
import { getMyBookings, getOwnerBookings, updateBookingStatus, cancelBooking, getAllBookings } from "../api/bookingApi";
import { getFavorites } from "../api/authApi";
import { getAllUsers } from "../api/authApi";
import { getSavedSearches, deleteSavedSearch } from "../api/savedSearchApi";
import PropertyCard from "../components/PropertyCard";
import PageMeta from "../components/PageMeta";
import EmptyState from "../components/ui/EmptyState";

function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (user.role === "owner" || user.role === "admin") {
          const propData = await getMyProperties();
          setProperties(propData.properties || []);
        }
        if (user.role === "tenant") {
          const [bookData, favData, searchData] = await Promise.all([
            getMyBookings(bookingFilter ? { status: bookingFilter } : {}),
            getFavorites(),
            getSavedSearches().catch(() => ({ savedSearches: [] })),
          ]);
          setBookings(bookData.bookings || []);
          setFavorites(favData.properties || []);
          setSavedSearches(searchData.savedSearches || []);
        }
        if (user.role === "owner") {
          const ownerBooks = await getOwnerBookings(bookingFilter ? { status: bookingFilter } : {});
          setBookings(ownerBooks.bookings || []);
        }
        if (user.role === "admin") {
          const [statsData, allBooks, usersData, propsData] = await Promise.all([
            getAdminStats(),
            getAllBookings(),
            getAllUsers(),
            getAllPropertiesAdmin(),
          ]);
          setStats(statsData.stats);
          setBookings(allBooks.bookings || []);
          setUsers(usersData.users || []);
          setAllProperties(propsData.properties || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, bookingFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await deleteProperty(id);
    setProperties(properties.filter((p) => p._id !== id));
  };

  const handleBookingStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)));
  };

  const handleCancel = async (id) => {
    await cancelBooking(id);
    setBookings(bookings.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
  };

  if (loading) return <div className="page-loader"><div className="loader-ring" /></div>;

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="page-section" id="main">
      <PageMeta title="Dashboard" />
      <div className="container-xl">
        <p className="section-label">Dashboard</p>
        <h1 className="display-title" style={{ fontSize: "2.8rem", marginBottom: 8 }}>Hello, {user.fullName}</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>Role: <strong style={{ textTransform: "capitalize" }}>{user.role}</strong></p>

        <div className="dash-tabs">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</button>
          {user.role === "tenant" && <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>Saved Homes</button>}
          {(user.role === "owner" || user.role === "admin") && <button className={tab === "properties" ? "active" : ""} onClick={() => setTab("properties")}>My Properties</button>}
          <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>Bookings {pendingCount > 0 && `(${pendingCount})`}</button>
          {user.role === "admin" && <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Users</button>}
          {user.role === "admin" && <button className={tab === "allprops" ? "active" : ""} onClick={() => setTab("allprops")}>All Properties</button>}
        </div>

        {tab === "overview" && (
          <div className="stats-grid">
            {user.role === "admin" && stats && (
              <>
                <div className="stat-card glass-card"><h3>{stats.users}</h3><p>Users</p></div>
                <div className="stat-card glass-card"><h3>{stats.properties}</h3><p>Properties</p></div>
                <div className="stat-card glass-card"><h3>{stats.bookings}</h3><p>Bookings</p></div>
                <div className="stat-card glass-card"><h3>{stats.pendingBookings}</h3><p>Pending</p></div>
              </>
            )}
            {user.role === "owner" && (
              <>
                <div className="stat-card glass-card"><h3>{properties.length}</h3><p>Listings</p></div>
                <div className="stat-card glass-card"><h3>{pendingCount}</h3><p>Pending Requests</p></div>
              </>
            )}
            {user.role === "tenant" && (
              <>
                <div className="stat-card glass-card"><h3>{favorites.length}</h3><p>Saved Homes</p></div>
                <div className="stat-card glass-card"><h3>{bookings.length}</h3><p>My Bookings</p></div>
                <div className="stat-card glass-card"><h3>{savedSearches.length}</h3><p>Saved Searches</p></div>
              </>
            )}
            {(user.role === "owner" || user.role === "admin") && (
              <Link to="/add-property" className="stat-card glass-card action-card"><h3>+</h3><p>List Property</p></Link>
            )}
          </div>
        )}

        {tab === "saved" && (
          favorites.length === 0 ? (
            <EmptyState title="No saved homes" message="Browse properties and tap the heart to save." action={<Link to="/properties" className="btn-primary-custom" style={{ display: "inline-block", marginTop: 16 }}>Browse</Link>} />
          ) : (
            <div className="properties-grid">{favorites.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}</div>
          )
        )}

        {tab === "properties" && (
          <div className="dash-list">
            {properties.length === 0 ? <p>No properties listed. <Link to="/add-property">Add one</Link></p> : properties.map((p) => (
              <div key={p._id} className="dash-item glass-card">
                <img src={p.images?.[0]} alt={p.title} />
                <div className="dash-item-info"><h3>{p.title}</h3><p>{p.city} · ₹{p.price?.toLocaleString()}/mo · {p.available ? "Available" : "Unavailable"}</p></div>
                <div className="dash-actions">
                  <Link to={`/edit-property/${p._id}`} className="btn-outline-custom">Edit</Link>
                  <button className="btn-outline-custom" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "bookings" && (
          <>
            <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["", "pending", "approved", "rejected", "cancelled"].map((s) => (
                <button key={s} className={`btn-outline-custom ${bookingFilter === s ? "active" : ""}`} style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => setBookingFilter(s)}>
                  {s || "All"}
                </button>
              ))}
            </div>
            <div className="dash-list">
              {bookings.length === 0 ? <p>No bookings yet.</p> : bookings.filter((b) => !bookingFilter || b.status === bookingFilter).map((b) => (
                <div key={b._id} className="dash-item glass-card">
                  <div className="dash-item-info">
                    <h3>{b.property?.title}</h3>
                    <p>{user.role === "owner" || user.role === "admin" ? `Tenant: ${b.tenant?.fullName}` : `Owner: ${b.owner?.fullName}`}</p>
                    <p>Move-in: {new Date(b.moveInDate).toLocaleDateString()}</p>
                    {b.message && <p style={{ color: "var(--text-muted)" }}>"{b.message}"</p>}
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </div>
                  <div className="dash-actions">
                    {(user.role === "owner" || user.role === "admin") && b.status === "pending" && (
                      <>
                        <button className="btn-primary-custom" onClick={() => handleBookingStatus(b._id, "approved")}>Approve</button>
                        <button className="btn-outline-custom" onClick={() => handleBookingStatus(b._id, "rejected")}>Reject</button>
                      </>
                    )}
                    {user.role === "tenant" && ["pending", "approved"].includes(b.status) && (
                      <button className="btn-outline-custom" onClick={() => handleCancel(b._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {user.role === "tenant" && savedSearches.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h3 style={{ marginBottom: 16 }}>Saved Searches</h3>
                {savedSearches.map((s) => (
                  <div key={s._id} className="dash-item glass-card">
                    <div className="dash-item-info"><h3>{s.name}</h3><p>{JSON.stringify(s.filters)}</p></div>
                    <button className="btn-outline-custom" onClick={() => deleteSavedSearch(s._id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "users" && user.role === "admin" && (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}><td>{u.fullName}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isVerified ? "Yes" : "No"}</td></tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "allprops" && user.role === "admin" && (
          <table className="admin-table">
            <thead><tr><th>Title</th><th>City</th><th>Price</th><th>Owner</th><th>Actions</th></tr></thead>
            <tbody>
              {allProperties.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td><td>{p.city}</td><td>₹{p.price?.toLocaleString()}</td><td>{p.owner?.fullName}</td>
                  <td><button className="btn-outline-custom" style={{ padding: "4px 12px", fontSize: "0.8rem" }} onClick={async () => { if (window.confirm("Remove?")) { await deleteProperty(p._id); setAllProperties(allProperties.filter((x) => x._id !== p._id)); } }}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
