import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const horaService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.HORAS, { params: filters }),

  filtrar: (filters = {}) =>
    apiClient.post(`${API_ENDPOINTS.HORAS}/filtrar`, filters),

  create: (data) => apiClient.post(API_ENDPOINTS.HORAS, data),
};
