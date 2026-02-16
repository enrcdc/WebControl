import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const almacenService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.ALMACEN, { params: filters }),

  buscarPorDescripcion: (descripcion) =>
    apiClient.get(`${API_ENDPOINTS.ALMACEN}/buscar/descripcion`, {
      params: { descripcion },
    }),

  create: (data) => apiClient.post(API_ENDPOINTS.ALMACEN, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.ALMACEN}/${id}`, data),

  delete: (ids) => apiClient.delete(API_ENDPOINTS.ALMACEN, { data: { ids } }),
};

export const movimientoAlmacenService = {
  getByObra: (idObra) =>
    apiClient.get(`${API_ENDPOINTS.MOVIMIENTOS_ALMACEN}/obra/${idObra}`),

  create: (data) => apiClient.post(API_ENDPOINTS.MOVIMIENTOS_ALMACEN, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.MOVIMIENTOS_ALMACEN}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.MOVIMIENTOS_ALMACEN, { data: { ids } }),
};
