import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const rentabilidadService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.RENTABILIDAD, { params: filters }),

  getByObra: (idObra) =>
    apiClient.get(`${API_ENDPOINTS.RENTABILIDAD}/${idObra}`),
};
