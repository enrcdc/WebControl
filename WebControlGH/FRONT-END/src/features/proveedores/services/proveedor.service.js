import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const proveedorService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.PROVEEDOR, { params: filters }),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.PROVEEDOR}/${id}`),

  getUltimoCodigo: () =>
    apiClient.get(`${API_ENDPOINTS.PROVEEDOR}/ultimo-codigo`),

  create: (data) => apiClient.post(API_ENDPOINTS.PROVEEDOR, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.PROVEEDOR}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.PROVEEDOR, { data: { idProveedores: ids } }),
};
