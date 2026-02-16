import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const gastoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.GASTOS, { params: filters }),

  getByObras: (idsObra) =>
    apiClient.post(`${API_ENDPOINTS.GASTOS}/buscar`, { idsObra }),

  create: (data) => apiClient.post(API_ENDPOINTS.GASTOS, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.GASTOS}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.GASTOS, { data: { ids } }),
};
