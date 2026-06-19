import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../api/propertyApi";

function AddProperty() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    address: "",
    price: "",
    propertyType: "Apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnished: false,
    parking: false,
    images: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: formData.images
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean),
      };
      await addProperty(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="container-xl form-container">
        <p className="section-label">List your home</p>
        <h1 className="display-title" style={{ fontSize: "2.5rem", marginBottom: "24px" }}>
          Add a property
        </h1>

        {error && <div className="alert-custom alert-error">{error}</div>}

        <form className="property-form glass-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="title" placeholder="Property Title" className="form-control-custom" required onChange={handleChange} />
            <select name="propertyType" className="form-control-custom" onChange={handleChange} defaultValue="Apartment">
              <option>Apartment</option>
              <option>Villa</option>
              <option>Independent House</option>
              <option>Studio</option>
              <option>PG</option>
            </select>
            <input name="city" placeholder="City" className="form-control-custom" required onChange={handleChange} />
            <input name="state" placeholder="State" className="form-control-custom" required onChange={handleChange} />
            <input name="address" placeholder="Full Address" className="form-control-custom" required onChange={handleChange} />
            <input name="price" type="number" placeholder="Monthly Rent (₹)" className="form-control-custom" required onChange={handleChange} />
            <input name="bedrooms" type="number" placeholder="Bedrooms" className="form-control-custom" required onChange={handleChange} />
            <input name="bathrooms" type="number" placeholder="Bathrooms" className="form-control-custom" required onChange={handleChange} />
            <input name="area" type="number" placeholder="Area (sqft)" className="form-control-custom" required onChange={handleChange} />
          </div>

          <textarea
            name="description"
            placeholder="Property description..."
            className="form-control-custom"
            rows="4"
            required
            onChange={handleChange}
            style={{ marginTop: "16px" }}
          />

          <textarea
            name="images"
            placeholder="Image URLs (one per line) — use Unsplash links or any public image URL"
            className="form-control-custom"
            rows="3"
            onChange={handleChange}
            style={{ marginTop: "16px" }}
          />

          <div className="checkbox-row" style={{ marginTop: "16px" }}>
            <label><input type="checkbox" name="furnished" onChange={handleChange} /> Furnished</label>
            <label><input type="checkbox" name="parking" onChange={handleChange} /> Parking</label>
          </div>

          <button type="submit" className="btn-primary-custom" style={{ marginTop: "24px" }} disabled={loading}>
            {loading ? "Publishing..." : "Publish Listing"}
          </button>
        </form>
      </div>

      <style>{`
        .form-container { max-width: 800px; }
        .property-form { padding: 32px; }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .checkbox-row { display: flex; gap: 24px; }
        .checkbox-row label { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

export default AddProperty;
