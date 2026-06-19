import API from "./axios";

export const getPropertyReviews = async (propertyId) => {
  const res = await API.get(`/reviews/${propertyId}`);
  return res.data;
};

export const createReview = async (data) => {
  const res = await API.post("/reviews", data);
  return res.data;
};
