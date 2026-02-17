import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const empresaService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.EMPRESA, { params: filters }),

  getById: (idEmpresa) =>
    apiClient.get(`${API_ENDPOINTS.EMPRESA}/${idEmpresa}`),

  // TODO: Este debería desaparecer y ser sustituido por getAll + filters
  buscarPorNombre: (nombre) =>
    apiClient.get(`${API_ENDPOINTS.EMPRESA}/buscar/nombre`, {
      params: { nombre },
    }),

  create: (data) => apiClient.post(API_ENDPOINTS.EMPRESA, data),

  update: (idEmpresa, data) =>
    apiClient.patch(`${API_ENDPOINTS.EMPRESA}/${idEmpresa}`, data),

  delete: (idEmpresas) =>
    apiClient.delete(API_ENDPOINTS.EMPRESA, { data: { idEmpresas } }),
};
