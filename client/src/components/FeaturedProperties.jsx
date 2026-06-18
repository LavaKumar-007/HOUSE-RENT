import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { getProperties } from "../api/propertyApi";

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();

        if (data.success) {
          setProperties(data.properties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2
  style={{
    fontSize: "3rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10px",
  }}
>
            Featured Properties
          </h2>
          <p
  style={{
    textAlign: "center",
    color: "#64748b",
    marginBottom: "50px",
  }}
>
  Discover handpicked homes from verified owners
</p>

          <p className="text-muted">
            Discover verified rental homes across India
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <h5>Loading properties...</h5>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center">
            <h5>No properties available</h5>
          </div>
        ) : (
          <div className="row g-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="col-lg-4 col-md-6"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;