import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaBed, FaBath, FaCar, FaCouch } from "react-icons/fa";
import { getPropertyById } from "../api/propertyApi";
import { createBooking } from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ moveInDate: "", message: "" });
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingError, setBookingError] = useState("");

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

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingError("");
    try {
      const data = await createBooking({
        propertyId: id,
        ...bookingForm,
      });
      setBookingMsg(data.message);
      setShowBooking(false);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) {
    return <div className="page-loader"><div className="loader-ring" /></div>;
  }

  if (!property) {
    return (
      <div className="page-section container-xl">
        <h2>Property not found</h2>
        <Link to="/properties">Back to listings</Link>
      </div>
    );
  }

  const images = property.images?.length
    ? property.images
    : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"];

  return (
    <div className="page-section">
      <div className="container-xl detail-layout">
        <div className="gallery">
          <img src={images[activeImage]} alt={property.title} className="main-image" />
          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={activeImage === i ? "active" : ""}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-content">
          <span className="section-label">{property.propertyType}</span>
          <h1 className="display-title detail-title">{property.title}</h1>
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
            <p>{property.description}</p>
          </div>

          {property.owner && (
            <div className="owner-card glass-card">
              <h3>Listed by</h3>
              <p><strong>{property.owner.fullName}</strong></p>
              <p>{property.owner.email}</p>
              <p>{property.owner.phone}</p>
            </div>
          )}

          {bookingMsg && <div className="alert-custom alert-success">{bookingMsg}</div>}
          {bookingError && <div className="alert-custom alert-error">{bookingError}</div>}

          {!showBooking ? (
            <button className="btn-primary-custom book-btn" onClick={() => setShowBooking(true)}>
              Request to Book
            </button>
          ) : (
            <form className="booking-form glass-card" onSubmit={handleBooking}>
              <h3>Booking Request</h3>
              <input
                type="date"
                className="form-control-custom mb-3"
                required
                value={bookingForm.moveInDate}
                onChange={(e) => setBookingForm({ ...bookingForm, moveInDate: e.target.value })}
              />
              <textarea
                className="form-control-custom mb-3"
                placeholder="Message to owner (optional)"
                rows="3"
                value={bookingForm.message}
                onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary-custom">Send Request</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowBooking(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .detail-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .main-image {
          width: 100%;
          height: 480px;
          object-fit: cover;
          border-radius: 24px;
        }
        .thumb-row { display: flex; gap: 12px; margin-top: 12px; }
        .thumb-row img {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          opacity: 0.6;
          border: 2px solid transparent;
        }
        .thumb-row img.active { opacity: 1; border-color: var(--primary); }
        .detail-title { font-size: clamp(2rem, 4vw, 2.8rem); margin: 8px 0; }
        .detail-price { color: var(--primary); font-size: 1.8rem; margin: 12px 0; }
        .detail-price span { font-size: 1rem; color: var(--text-muted); font-weight: 400; }
        .detail-address { color: var(--text-muted); margin-bottom: 24px; }
        .amenity-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
        }
        .amenity-row span { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .detail-section h3 { margin-bottom: 12px; }
        .detail-section p { line-height: 1.8; color: var(--text-muted); }
        .owner-card { padding: 24px; margin: 24px 0; }
        .owner-card h3 { margin-bottom: 12px; }
        .book-btn { margin-top: 16px; }
        .booking-form { padding: 24px; margin-top: 16px; }
        .booking-form h3 { margin-bottom: 16px; }
        .mb-3 { margin-bottom: 12px; }
        @media (max-width: 900px) {
          .detail-layout { grid-template-columns: 1fr; }
          .main-image { height: 320px; }
        }
      `}</style>
    </div>
  );
}

export default PropertyDetails;
