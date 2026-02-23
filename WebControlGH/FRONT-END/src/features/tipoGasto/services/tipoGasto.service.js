import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const tipoGastoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.TIPO_GASTO, { params: filters }),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.TIPO_GASTO}/${id}`),

  filtrar: (filters = {}) =>
    apiClient.post(`${API_ENDPOINTS.TIPO_GASTO}/filtrar`, filters),

  create: (data) => apiClient.post(API_ENDPOINTS.TIPO_GASTO, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.TIPO_GASTO}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.TIPO_GASTO, {
      data: { idsTipoGasto: ids },
    }),
};
