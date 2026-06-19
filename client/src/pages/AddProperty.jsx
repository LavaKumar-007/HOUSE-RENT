import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../api/propertyApi";
import PropertyForm from "../components/PropertyForm";
import PageMeta from "../components/PageMeta";

function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload, setError) => {
    setLoading(true);
    try {
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
      <PageMeta title="List Property" />
      <div className="container-xl form-container">
        <p className="section-label">List your home</p>
        <h1 className="display-title" style={{ fontSize: "2.5rem", marginBottom: 24 }}>Add a property</h1>
        <PropertyForm onSubmit={handleSubmit} submitLabel="Publish Listing" loading={loading} />
      </div>
    </div>
  );
}

export default AddProperty;
