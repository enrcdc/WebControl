import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const facturaService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.FACTURA_OBRA, { params: filters }),

  /**
   * filtrar recupera todas las facturas de obra según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idFactura] - filtrar por id
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.codigoFactura] - filtrar por código de factura (like)
   * @param {string} [filters.conceptoLinea] - filtrar por concepto de línea (like)
   * @param {string} [filters.conceptoFactura] - filtrar por concepto de factura (like)
   * @param {string} [filters.codigoPedido] - filtrar por código de pedido (like)
   * @param {boolean} [filters.mostrarBaja] - true: solo dadas de baja, false: solo activas
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  filtrar: (filters = {}) =>
    apiClient.post(`${API_ENDPOINTS.FACTURA_OBRA}/filtrar`, filters),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.FACTURA_OBRA}/${id}`),

  create: (data) => apiClient.post(API_ENDPOINTS.FACTURA_OBRA, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.FACTURA_OBRA}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.FACTURA_OBRA, { data: { ids } }),
};
