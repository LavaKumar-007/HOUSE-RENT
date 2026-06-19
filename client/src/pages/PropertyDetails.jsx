import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaBed, FaBath, FaCar, FaCouch, FaHeart, FaStar } from "react-icons/fa";
import { getPropertyById } from "../api/propertyApi";
import { createBooking } from "../api/bookingApi";
import { getPropertyReviews, createReview } from "../api/reviewApi";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import PageMeta from "../components/PageMeta";
import { SkeletonGrid } from "../components/ui/Skeleton";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateFavorites } = useAuth();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ moveInDate: "", message: "" });
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data.property);
        setSimilar(data.similar || []);
        const rev = await getPropertyReviews(id);
        setReviews(rev.reviews || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (user?.favorites) {
      setFavorited(user.favorites.some((f) => (f._id || f).toString() === id));
    }
  }, [user, id]);

  const handleFavorite = async () => {
    if (!user) { navigate("/login"); return; }
    const data = await updateFavorites(id);
    setFavorited(data.favorites.some((f) => f.toString() === id));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setBookingError("");
    try {
      const data = await createBooking({ propertyId: id, ...bookingForm });
      setBookingMsg(data.message);
      setShowBooking(false);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ propertyId: id, ...reviewForm });
      const rev = await getPropertyReviews(id);
      setReviews(rev.reviews || []);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    }
  };

  if (loading) return <div className="page-section"><SkeletonGrid count={1} /></div>;
  if (!property) return <div className="page-section container-xl"><h2>Property not found</h2><Link to="/properties">Back</Link></div>;

  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"];

  return (
    <div className="page-section" id="main">
      <PageMeta title={property.title} description={property.description?.slice(0, 150)} />
      <div className="container-xl detail-layout">
        <div className="gallery">
          <img src={images[activeImage]} alt={property.title} className="main-image" />
          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" className={activeImage === i ? "active" : ""} onClick={() => setActiveImage(i)} />
              ))}
            </div>
          )}
        </div>
        <div className="detail-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <span className="section-label">{property.propertyType}</span>
            <button className={`favorite-btn ${favorited ? "active" : ""}`} onClick={handleFavorite} style={{ position: "static" }}><FaHeart /></button>
          </div>
          <h1 className="display-title detail-title">{property.title}</h1>
          {property.averageRating > 0 && <p className="rating-badge"><FaStar /> {property.averageRating} · {property.reviewCount} reviews</p>}
          <h2 className="detail-price">₹{property.price?.toLocaleString()} <span>/ month</span></h2>
          <p className="detail-address">{property.address}, {property.city}, {property.state}</p>
          <div className="amenity-row">
            <span><FaBed /> {property.bedrooms} Beds</span>
            <span><FaBath /> {property.bathrooms} Baths</span>
            <span>{property.area} sqft</span>
            {property.furnished && <span><FaCouch /> Furnished</span>}
            {property.parking && <span><FaCar /> Parking</span>}
          </div>
          <div className="detail-section">
            <h3>Description</h3>
            <p style={{ lineHeight: 1.8, color: "var(--text-muted)" }}>{property.description}</p>
          </div>
          {property.owner && (
            <div className="owner-card glass-card">
              <h3>Listed by {property.owner.fullName}</h3>
              {property.owner.isVerified && <span className="status-badge status-approved">Verified Owner</span>}
              <p style={{ marginTop: 12 }}>{property.owner.email}</p>
            </div>
          )}
          {bookingMsg && <div className="alert-custom alert-success">{bookingMsg}</div>}
          {bookingError && <div className="alert-custom alert-error">{bookingError}</div>}
          {!showBooking ? (
            <button className="btn-primary-custom book-btn" onClick={() => setShowBooking(true)}>Request to Book</button>
          ) : (
            <form className="booking-form glass-card" onSubmit={handleBooking}>
              <h3>Booking Request</h3>
              <input type="date" className="form-control-custom mb-3" required value={bookingForm.moveInDate} onChange={(e) => setBookingForm({ ...bookingForm, moveInDate: e.target.value })} />
              <textarea className="form-control-custom mb-3" placeholder="Message to owner" rows="3" value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} />
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="btn-primary-custom">Send Request</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowBooking(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="container-xl" style={{ marginTop: 60 }}>
        <h2 className="display-title" style={{ fontSize: "2rem", marginBottom: 24 }}>Reviews</h2>
        {reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            <p style={{ margin: "8px 0" }}>{r.comment}</p>
            <small style={{ color: "var(--text-muted)" }}>— {r.tenant?.fullName}</small>
          </div>
        ))}
        {user?.role === "tenant" && (
          <form className="glass-card" style={{ padding: 24, marginTop: 16 }} onSubmit={handleReview}>
            <h3 style={{ marginBottom: 12 }}>Write a review</h3>
            <select className="form-control-custom mb-3" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea className="form-control-custom mb-3" required placeholder="Your review" rows="3" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <button className="btn-primary-custom">Submit Review</button>
          </form>
        )}
      </div>

      {similar.length > 0 && (
        <div className="container-xl" style={{ marginTop: 60 }}>
          <h2 className="display-title" style={{ fontSize: "2rem", marginBottom: 24 }}>Similar properties</h2>
          <div className="properties-grid">
            {similar.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        </div>
      )}

      <div className="mobile-book-bar">
        <button className="btn-primary-custom w-100" onClick={() => setShowBooking(true)}>Book — ₹{property.price?.toLocaleString()}/mo</button>
      </div>
    </div>
  );
}

export default PropertyDetails;
