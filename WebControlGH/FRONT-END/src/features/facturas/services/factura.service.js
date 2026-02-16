import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const facturaService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.FACTURA_OBRA, { params: filters }),

  getById: (id) =>
    apiClient.get(`${API_ENDPOINTS.FACTURA_OBRA}/${id}`),

  getByObras: (idsObras) =>
    apiClient.post(`${API_ENDPOINTS.FACTURA_OBRA}/buscar`, { idsObras }),

  create: (data) => apiClient.post(API_ENDPOINTS.FACTURA_OBRA, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.FACTURA_OBRA}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.FACTURA_OBRA, { data: { ids } }),
};
