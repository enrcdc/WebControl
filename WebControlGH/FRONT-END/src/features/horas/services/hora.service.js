import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const horaService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.HORAS, { params: filters }),

  getBySubordinados: (codigoResponsable) =>
    apiClient.get(`${API_ENDPOINTS.HORAS}/subordinados/${codigoResponsable}`),

  getByObras: (idsObra) =>
    apiClient.post(`${API_ENDPOINTS.HORAS}/buscar`, { idsObra }),

  getHorasExtra: (idsObra) =>
    apiClient.post(`${API_ENDPOINTS.GASTOS}/horas-extra/buscar`, { idsObra }),

  create: (data) => apiClient.post(API_ENDPOINTS.HORAS, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.HORAS}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.HORAS, { data: { ids } }),
};
