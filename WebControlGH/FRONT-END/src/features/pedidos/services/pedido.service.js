import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const pedidoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.PEDIDO_OBRA, { params: filters }),

  /**
   * filtrar recupera todos los pedidos de obra según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idPedido] - filtrar por id
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.codigoPedido] - filtrar por código de pedido (like)
   * @param {string} [filters.posicion] - filtrar por posición (like)
   * @param {string} [filters.observaciones] - filtrar por observaciones (like)
   * @param {boolean} [filters.mostrarBaja] - true: solo dados de baja, false: solo activos
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  filtrar: (filters = {}) =>
    apiClient.post(`${API_ENDPOINTS.PEDIDO_OBRA}/filtrar`, filters),

  getById: (id) => apiClient.get(`${API_ENDPOINTS.PEDIDO_OBRA}/${id}`),

  create: (data) => apiClient.post(API_ENDPOINTS.PEDIDO_OBRA, data),

  update: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.PEDIDO_OBRA}/${id}`, data),

  delete: (ids) =>
    apiClient.delete(API_ENDPOINTS.PEDIDO_OBRA, { data: { idPedidos: ids } }),
};
