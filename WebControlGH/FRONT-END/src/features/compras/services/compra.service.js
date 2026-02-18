import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const compraService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.FACTURA_COMPRA, { params: filters }),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.FACTURA_COMPRA}/${id}`),

  create: (data) => apiClient.post(API_ENDPOINTS.FACTURA_COMPRA, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.FACTURA_COMPRA}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.FACTURA_COMPRA, { data: { ids } }),
};
