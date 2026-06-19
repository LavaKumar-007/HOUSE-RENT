import { useState } from "react";
import { uploadImages } from "../api/uploadApi";

const defaultForm = {
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
  available: true,
  images: "",
};

function PropertyForm({ initialData, onSubmit, submitLabel, loading }) {
  const [formData, setFormData] = useState(initialData || defaultForm);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const imageUrls = formData.images
    ? formData.images.split("\n").map((u) => u.trim()).filter(Boolean)
    : [];

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const data = await uploadImages(files);
      const combined = [...imageUrls, ...data.urls].join("\n");
      setFormData({ ...formData, images: combined });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    onSubmit({
      ...formData,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      images: imageUrls,
    }, setError);
  };

  return (
    <form className="property-form glass-card" onSubmit={handleSubmit}>
      {error && <div className="alert-custom alert-error">{error}</div>}
      <div className="form-grid">
        <input name="title" placeholder="Property Title" className="form-control-custom" required value={formData.title} onChange={handleChange} />
        <select name="propertyType" className="form-control-custom" value={formData.propertyType} onChange={handleChange}>
          <option>Apartment</option><option>Villa</option><option>Independent House</option><option>Studio</option><option>PG</option>
        </select>
        <input name="city" placeholder="City" className="form-control-custom" required value={formData.city} onChange={handleChange} />
        <input name="state" placeholder="State" className="form-control-custom" required value={formData.state} onChange={handleChange} />
        <input name="address" placeholder="Full Address" className="form-control-custom" required value={formData.address} onChange={handleChange} />
        <input name="price" type="number" placeholder="Monthly Rent (₹)" className="form-control-custom" required value={formData.price} onChange={handleChange} />
        <input name="bedrooms" type="number" placeholder="Bedrooms" className="form-control-custom" required value={formData.bedrooms} onChange={handleChange} />
        <input name="bathrooms" type="number" placeholder="Bathrooms" className="form-control-custom" required value={formData.bathrooms} onChange={handleChange} />
        <input name="area" type="number" placeholder="Area (sqft)" className="form-control-custom" required value={formData.area} onChange={handleChange} />
      </div>
      <textarea name="description" placeholder="Property description..." className="form-control-custom" rows="4" required value={formData.description} onChange={handleChange} style={{ marginTop: 16 }} />
      <textarea name="images" placeholder="Image URLs (one per line)" className="form-control-custom" rows="3" value={formData.images} onChange={handleChange} style={{ marginTop: 16 }} />
      {imageUrls.length > 0 && (
        <div className="image-preview-grid">
          {imageUrls.map((url, i) => <img key={i} src={url} alt="" />)}
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <label className="btn-outline-custom" style={{ display: "inline-block", cursor: "pointer" }}>
          {uploading ? "Uploading..." : "Upload Images"}
          <input type="file" accept="image/*" multiple hidden onChange={handleFileUpload} />
        </label>
      </div>
      <div className="checkbox-row" style={{ marginTop: 16 }}>
        <label><input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} /> Furnished</label>
        <label><input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} /> Parking</label>
        <label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Available</label>
      </div>
      <button type="submit" className="btn-primary-custom" style={{ marginTop: 24 }} disabled={loading || uploading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;
