import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

export const obraService = {
  /**
   * getAll recupera todas las obras según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idObra] - filtrar por id
   * @param {string} [filters.empresa] - filtrar por nombre de empresa (like)
   * @param {string} [filters.complejo] - filtrar por nombre de edificio (like)
   * @param {string} [filters.descripcion] - filtrar por descripción de obra (like)
   * @param {string} [filters.codigo] - filtrar por codigo de obra (like)
   * @param {Array<string>} [filters.estados] - filtrar por descripciones de estado [Array]
   * @param {Array<string>} [filters.tipos] - filtrar por descripciones de tipo [Array]
   * @param {boolean} [filters.enSeguimiento] - true: con fecha_seg, false: sin fecha_seg
   * @param {boolean} [filters.ofertada] - true: con fecha_oferta, false: sin fecha_oferta
   * @param {string} [filters.fechaDesde] - filtrar desde fecha de alta (inclusive)
   * @param {string} [filters.fechaHasta] - filtrar hasta fecha de alta (inclusive)
   * @param {boolean} [filters.conPedidos] - true: con pedidos, false: sin pedidos
   * @param {boolean} [filters.conFacturas] - true: con facturas, false: sin facturas
   * @param {boolean} [filters.conHoras] - true: con horas, false: sin horas
   * @param {boolean} [filters.conGastos] - true: con gastos, false: sin gastos
   * @param {boolean} [filters.mostrarBaja] - true: solo dadas de baja, false: solo activas
   * @param {string} [filters.relacionEntreObras] - filtrar por relación padre/hija: "mostrarHijas", "mostrarPadres", "mostrarPadresHijas", "ocultarHijas", "ocultarPadres", "ocultarPadresHijas"
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
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
