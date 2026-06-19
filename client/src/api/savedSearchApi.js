import API from "./axios";

export const getSavedSearches = async () => {
  const res = await API.get("/saved-searches");
  return res.data;
};

export const createSavedSearch = async (data) => {
  const res = await API.post("/saved-searches", data);
  return res.data;
};

export const deleteSavedSearch = async (id) => {
  const res = await API.delete(`/saved-searches/${id}`);
  return res.data;
};
