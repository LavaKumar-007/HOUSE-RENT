import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProperties, deleteProperty, getAdminStats } from "../api/propertyApi";
import { getMyBookings, getOwnerBookings, updateBookingStatus, getAllBookings } from "../api/bookingApi";

function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
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
          const bookData = await getMyBookings();
          setBookings(bookData.bookings || []);
        }
        if (user.role === "owner") {
          const ownerBooks = await getOwnerBookings();
          setBookings(ownerBooks.bookings || []);
        }
        if (user.role === "admin") {
          const [statsData, allBooks] = await Promise.all([
            getAdminStats(),
            getAllBookings(),
          ]);
          setStats(statsData.stats);
          setBookings(allBooks.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await deleteProperty(id);
    setProperties(properties.filter((p) => p._id !== id));
  };

  const handleBookingStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    setBookings(
      bookings.map((b) => (b._id === id ? { ...b, status } : b))
    );
  };

  if (loading) {
    return <div className="page-loader"><div className="loader-ring" /></div>;
  }

  return (
    <div className="page-section">
      <div className="container-xl">
        <p className="section-label">Dashboard</p>
        <h1 className="display-title" style={{ fontSize: "2.8rem", marginBottom: "8px" }}>
          Hello, {user.fullName}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
          Role: <strong style={{ textTransform: "capitalize" }}>{user.role}</strong>
        </p>

        <div className="dash-tabs">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
            Overview
          </button>
          {(user.role === "owner" || user.role === "admin") && (
            <button className={tab === "properties" ? "active" : ""} onClick={() => setTab("properties")}>
              My Properties
            </button>
          )}
          <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>
            Bookings
          </button>
        </div>

        {tab === "overview" && (
          <div className="stats-grid">
            {user.role === "admin" && stats && (
              <>
                <div className="stat-card glass-card"><h3>{stats.users}</h3><p>Total Users</p></div>
                <div className="stat-card glass-card"><h3>{stats.properties}</h3><p>Properties</p></div>
                <div className="stat-card glass-card"><h3>{stats.bookings}</h3><p>Bookings</p></div>
              </>
            )}
            {user.role === "owner" && (
              <>
                <div className="stat-card glass-card"><h3>{properties.length}</h3><p>Listed Properties</p></div>
                <div className="stat-card glass-card"><h3>{bookings.filter(b => b.status === "pending").length}</h3><p>Pending Requests</p></div>
              </>
            )}
            {user.role === "tenant" && (
              <>
                <div className="stat-card glass-card"><h3>{bookings.length}</h3><p>My Bookings</p></div>
                <div className="stat-card glass-card"><h3>{user.favorites?.length || 0}</h3><p>Saved Homes</p></div>
              </>
            )}
            {(user.role === "owner" || user.role === "admin") && (
              <Link to="/add-property" className="stat-card glass-card action-card">
                <h3>+</h3><p>List New Property</p>
              </Link>
            )}
          </div>
        )}

        {tab === "properties" && (
          <div className="dash-list">
            {properties.length === 0 ? (
              <p>No properties listed yet. <Link to="/add-property">Add one</Link></p>
            ) : (
              properties.map((p) => (
                <div key={p._id} className="dash-item glass-card">
                  <img src={p.images?.[0]} alt={p.title} />
                  <div className="dash-item-info">
                    <h3>{p.title}</h3>
                    <p>{p.city} · ₹{p.price?.toLocaleString()}/mo</p>
                  </div>
                  <div className="dash-actions">
                    <Link to={`/edit-property/${p._id}`} className="btn-outline-custom">Edit</Link>
                    <button className="btn-outline-custom" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div className="dash-list">
            {bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              bookings.map((b) => (
                <div key={b._id} className="dash-item glass-card">
                  <div className="dash-item-info">
                    <h3>{b.property?.title}</h3>
                    <p>
                      {user.role === "owner" || user.role === "admin"
                        ? `Tenant: ${b.tenant?.fullName} (${b.tenant?.email})`
                        : `Owner: ${b.owner?.fullName}`}
                    </p>
                    <p>Move-in: {new Date(b.moveInDate).toLocaleDateString()}</p>
                    {b.message && <p style={{ color: "var(--text-muted)" }}>"{b.message}"</p>}
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </div>
                  {(user.role === "owner" || user.role === "admin") && b.status === "pending" && (
                    <div className="dash-actions">
                      <button className="btn-primary-custom" onClick={() => handleBookingStatus(b._id, "approved")}>
                        Approve
                      </button>
                      <button className="btn-outline-custom" onClick={() => handleBookingStatus(b._id, "rejected")}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        .dash-tabs { display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap; }
        .dash-tabs button {
          padding: 10px 22px;
          border-radius: 999px;
          border: 2px solid var(--border);
          background: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .dash-tabs button.active {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .stat-card { padding: 28px; text-align: center; }
        .stat-card h3 { font-size: 2.5rem; font-family: var(--font-display); }
        .stat-card p { color: var(--text-muted); margin-top: 8px; }
        .action-card { display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--primary); }
        .dash-list { display: flex; flex-direction: column; gap: 16px; }
        .dash-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          flex-wrap: wrap;
        }
        .dash-item img { width: 100px; height: 70px; object-fit: cover; border-radius: 12px; }
        .dash-item-info { flex: 1; min-width: 200px; }
        .dash-item-info h3 { margin-bottom: 6px; }
        .dash-actions { display: flex; gap: 10px; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}

export default Dashboard;
