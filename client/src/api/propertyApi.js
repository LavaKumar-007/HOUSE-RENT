import API from "./axios";

export const getProperties = async (params = {}) => {
  const res = await API.get("/properties", { params });
  return res.data;
};

export const getPropertyById = async (id) => {
  const res = await API.get(`/properties/${id}`);
  return res.data;
};

export const getMyProperties = async () => {
  const res = await API.get("/properties/mine");
  return res.data;
};

export const addProperty = async (data) => {
  const res = await API.post("/properties", data);
  return res.data;
};

export const updateProperty = async (id, data) => {
  const res = await API.put(`/properties/${id}`, data);
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await API.delete(`/properties/${id}`);
  return res.data;
};

export const getAdminStats = async () => {
  const res = await API.get("/properties/admin/stats");
  return res.data;
};

export const getAllPropertiesAdmin = async () => {
  const res = await API.get("/properties/admin/all");
  return res.data;
};
