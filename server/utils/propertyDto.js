const ALLOWED_PROPERTY_FIELDS = [
  "title",
  "description",
  "city",
  "state",
  "address",
  "price",
  "propertyType",
  "bedrooms",
  "bathrooms",
  "area",
  "furnished",
  "parking",
  "images",
  "available",
  "lat",
  "lng",
];

const pickPropertyFields = (body) => {
  const data = {};
  for (const key of ALLOWED_PROPERTY_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
};

module.exports = { pickPropertyFields };
