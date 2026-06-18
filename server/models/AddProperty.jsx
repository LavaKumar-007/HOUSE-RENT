import { useState } from "react";

function AddProperty() {
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
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Property submission coming next step");
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "120px auto",
        padding: "30px",
      }}
    >
      <h1>Add Property</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Property Title"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="form-control mb-3"
          rows="4"
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          name="state"
          placeholder="State"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Monthly Rent"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <select
          name="propertyType"
          className="form-control mb-3"
          onChange={handleChange}
        >
          <option>Apartment</option>
          <option>Villa</option>
          <option>Independent House</option>
          <option>PG</option>
        </select>

        <input
          name="bedrooms"
          placeholder="Bedrooms"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          name="bathrooms"
          placeholder="Bathrooms"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          name="area"
          placeholder="Area (sqft)"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Add Property
        </button>
      </form>
    </div>
  );
}

export default AddProperty;