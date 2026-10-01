import { api } from "./api.js";

// Client for the generic /api/resources/:resource CRUD endpoints.
export const resourceApi = {
  list: (resource, q = "") => api(`/resources/${resource}${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  create: (resource, body) => api(`/resources/${resource}`, { method: "POST", body }),
  update: (resource, id, body) => api(`/resources/${resource}/${id}`, { method: "PUT", body }),
  remove: (resource, id) => api(`/resources/${resource}/${id}`, { method: "DELETE" }),
  setStatus: (resource, id, status) => api(`/resources/${resource}/${id}/status`, { method: "PATCH", body: { status } })
};
