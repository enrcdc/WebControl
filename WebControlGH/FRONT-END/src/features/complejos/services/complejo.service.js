import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const complejoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.EDIFICIO, { params: filters }),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.EDIFICIO}/${id}`),

  create: (data) => apiClient.post(API_ENDPOINTS.EDIFICIO, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.EDIFICIO}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.EDIFICIO, { data: { idEdificios: ids } }),
};
