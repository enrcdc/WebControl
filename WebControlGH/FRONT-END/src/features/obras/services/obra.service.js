import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const obraService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.OBRA, { params: filters }),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.OBRA}/${id}`),

  create: (data) => apiClient.post(API_ENDPOINTS.OBRA, data),

  update: (id, data) => apiClient.put(`${API_ENDPOINTS.OBRA}/${id}`, data),

  delete: (id) => apiClient.delete(`${API_ENDPOINTS.OBRA}/${id}`),
};

export const relacionObraService = {
  getObraPadre: (idObra) =>
    apiClient.get(`${API_ENDPOINTS.RELACION_OBRAS}/padre/${idObra}`),

  getObrasHijas: (idObra) =>
    apiClient.get(`${API_ENDPOINTS.RELACION_OBRAS}/hijas/${idObra}`),

  setObraPadre: (data) =>
    apiClient.post(`${API_ENDPOINTS.RELACION_OBRAS}/padre`, data),

  setObrasHijas: (data) =>
    apiClient.post(`${API_ENDPOINTS.RELACION_OBRAS}/hijas`, data),
};
