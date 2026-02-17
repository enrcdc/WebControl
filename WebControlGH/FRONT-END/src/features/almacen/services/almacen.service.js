import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const almacenService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.ALMACEN, { params: filters }),

  create: (data) => apiClient.post(API_ENDPOINTS.ALMACEN, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.ALMACEN}/${id}`, data),

  delete: (id, codigoUsuarioBaja) =>
    apiClient.delete(`${API_ENDPOINTS.ALMACEN}/${id}`, {
      data: { codigoUsuarioBaja },
    }),
};

export const movimientoAlmacenService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.MOVIMIENTOS_ALMACEN, { params: filters }),

  create: (data) => apiClient.post(API_ENDPOINTS.MOVIMIENTOS_ALMACEN, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.MOVIMIENTOS_ALMACEN}/${id}`, data),

  delete: (id, codigoUsuarioBaja) =>
    apiClient.delete(`${API_ENDPOINTS.MOVIMIENTOS_ALMACEN}/${id}`, {
      data: { codigoUsuarioBaja },
    }),
};
