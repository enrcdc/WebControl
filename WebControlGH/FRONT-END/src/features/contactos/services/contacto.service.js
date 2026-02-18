import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const contactoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.CONTACTO, { params: filters }),

  create: (data) => apiClient.post(API_ENDPOINTS.CONTACTO, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.CONTACTO}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.CONTACTO, { data: { idContactos: ids } }),
};
