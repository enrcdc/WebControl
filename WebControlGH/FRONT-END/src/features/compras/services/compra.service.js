import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const compraService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.FACTURA_COMPRA, { params: filters }),

  getById: (id) =>
    apiClient.get(`${API_ENDPOINTS.FACTURA_COMPRA}/${id}`),

  getByObra: (idObra) =>
    apiClient.get(`${API_ENDPOINTS.FACTURA_COMPRA}/obra/${idObra}`),

  create: (data) => apiClient.post(API_ENDPOINTS.FACTURA_COMPRA, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.FACTURA_COMPRA}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.FACTURA_COMPRA, { data: { ids } }),

  buscarPorConcepto: (concepto) =>
    apiClient.get(`${API_ENDPOINTS.FACTURA_COMPRA}/buscar/concepto`, {
      params: { concepto },
    }),
};
