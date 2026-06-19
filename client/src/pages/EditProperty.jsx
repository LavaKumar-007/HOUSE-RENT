import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty } from "../api/propertyApi";
import PropertyForm from "../components/PropertyForm";
import PageMeta from "../components/PageMeta";
import { SkeletonGrid } from "../components/ui/Skeleton";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPropertyById(id)
      .then((data) => {
        const p = data.property;
        setInitialData({
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
          available: p.available,
          images: (p.images || []).join("\n"),
        });
      })
      .catch(() => setError("Failed to load property"));
  }, [id]);

  const handleSubmit = async (payload, setFormError) => {
    setLoading(true);
    try {
      await updateProperty(id, payload);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="page-section container-xl"><div className="alert-custom alert-error">{error}</div></div>;
  if (!initialData) return <div className="page-section"><SkeletonGrid count={1} /></div>;

  return (
    <div className="page-section">
      <PageMeta title="Edit Property" />
      <div className="container-xl form-container">
        <h1 className="display-title" style={{ fontSize: "2.5rem", marginBottom: 24 }}>Edit property</h1>
        <PropertyForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" loading={loading} />
      </div>
    </div>
  );
}

export default EditProperty;
