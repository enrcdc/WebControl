import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const gastoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.GASTOS, { params: filters }),

  /**
   * filtrar recupera todos los gastos según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idGasto] - filtrar por id
   * @param {string} [filters.tipo] - "por-validar" | "por-pagar"
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.codigoObra] - filtrar por código de obra
   * @param {string} [filters.descripcionObra] - filtrar por descripción de obra
   * @param {string} [filters.tipoGasto] - filtrar por tipo de gasto
   * @param {string} [filters.usuarioAlta] - filtrar por usuario de alta
   * @returns {Promise<Array>} Array de resultados de filtrado
   *
   */
  filtrar: (filters = {}) =>
    apiClient.post(`${API_ENDPOINTS.GASTOS}/filtrar`, filters),

  create: (data) => apiClient.post(API_ENDPOINTS.GASTOS, data),

  update: (id, data) => apiClient.patch(`${API_ENDPOINTS.GASTOS}/${id}`, data),

  delete: (ids) => apiClient.delete(API_ENDPOINTS.GASTOS, { data: { ids } }),
};
