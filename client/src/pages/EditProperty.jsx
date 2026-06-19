import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty } from "../api/propertyApi";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getPropertyById(id);
      const p = data.property;
      setFormData({
        title: p.title,
        description: p.description,
        city: p.city,
        state: p.state,
        address: p.address,
        price: p.price,
        propertyType: p.propertyType,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        furnished: p.furnished,
        parking: p.parking,
        images: (p.images || []).join("\n"),
        available: p.available,
      });
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: formData.images.split("\n").map((u) => u.trim()).filter(Boolean),
      };
      await updateProperty(id, payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <div className="page-loader"><div className="loader-ring" /></div>;

  return (
    <div className="page-section">
      <div className="container-xl form-container">
        <h1 className="display-title" style={{ fontSize: "2.5rem", marginBottom: "24px" }}>
          Edit property
        </h1>
        {error && <div className="alert-custom alert-error">{error}</div>}
        <form className="property-form glass-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="title" value={formData.title} className="form-control-custom" required onChange={handleChange} />
            <select name="propertyType" value={formData.propertyType} className="form-control-custom" onChange={handleChange}>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Independent House</option>
              <option>Studio</option>
              <option>PG</option>
            </select>
            <input name="city" value={formData.city} className="form-control-custom" required onChange={handleChange} />
            <input name="state" value={formData.state} className="form-control-custom" required onChange={handleChange} />
            <input name="address" value={formData.address} className="form-control-custom" required onChange={handleChange} />
            <input name="price" type="number" value={formData.price} className="form-control-custom" required onChange={handleChange} />
            <input name="bedrooms" type="number" value={formData.bedrooms} className="form-control-custom" required onChange={handleChange} />
            <input name="bathrooms" type="number" value={formData.bathrooms} className="form-control-custom" required onChange={handleChange} />
            <input name="area" type="number" value={formData.area} className="form-control-custom" required onChange={handleChange} />
          </div>
          <textarea name="description" value={formData.description} className="form-control-custom" rows="4" required onChange={handleChange} style={{ marginTop: "16px" }} />
          <textarea name="images" value={formData.images} className="form-control-custom" rows="3" onChange={handleChange} style={{ marginTop: "16px" }} />
          <div className="checkbox-row" style={{ marginTop: "16px" }}>
            <label><input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} /> Furnished</label>
            <label><input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} /> Parking</label>
            <label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Available</label>
          </div>
          <button type="submit" className="btn-primary-custom" style={{ marginTop: "24px" }} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <style>{`
        .form-container { max-width: 800px; }
        .property-form { padding: 32px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .checkbox-row { display: flex; gap: 24px; flex-wrap: wrap; }
        .checkbox-row label { display: flex; align-items: center; gap: 8px; font-weight: 600; }
      `}</style>
    </div>
  );
}

export default EditProperty;
