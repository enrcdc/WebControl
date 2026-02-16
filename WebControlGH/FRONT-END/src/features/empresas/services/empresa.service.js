import { apiClient } from "../../../Services/api/client";
import { API_ENDPOINTS } from "../../../constants/api";

export const empresaService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.EMPRESA, { params: filters }),

  create: (data) => apiClient.post(API_ENDPOINTS.EMPRESA, data),

  update: (idEmpresa, data) =>
    apiClient.patch(`${API_ENDPOINTS.EMPRESA}/${idEmpresa}`, data),

  delete: (ids) => apiClient.delete(API_ENDPOINTS.EMPRESA, { data: { ids } }),
};
