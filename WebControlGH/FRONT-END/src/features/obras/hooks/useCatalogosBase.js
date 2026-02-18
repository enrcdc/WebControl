// Hook atómico para gestionar la carga de catálogos/desplegables
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

// TODO: Dependencias cross-feature — estos catálogos se migrarán a sus features propias en Iteración 3

/**
 * Hook para cargar y gestionar catálogos/desplegables
 * Carga todos los catálogos comunes de obras al montarse
 *
 * @returns {Object} Estado y funciones de catálogos
 */
export const useCatalogosBase = () => {
  const [catalogos, setCatalogos] = useState({
    tiposObra: [],
    tiposFacturables: [],
    estadosObra: [],
    usuarios: [],
    empresas: [],
    edificios: [],
    contactosEmpresa: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga todos los catálogos principales
   */
  const fetchCatalogos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        tiposObra,
        tiposFacturables,
        estadosObra,
        usuarios,
        empresas,
        edificios,
      ] = await Promise.all([
        apiClient.get(API_ENDPOINTS.TIPO_OBRA),
        apiClient.get(API_ENDPOINTS.TIPO_FACTURABLE),
        apiClient.get(API_ENDPOINTS.ESTADO_OBRA),
        apiClient.get(API_ENDPOINTS.USUARIO),
        apiClient.get(API_ENDPOINTS.EMPRESA),
        apiClient.get(API_ENDPOINTS.EDIFICIO),
      ]);

      setCatalogos({
        tiposObra: tiposObra.data.data || [],
        tiposFacturables: tiposFacturables.data.data || [],
        estadosObra: estadosObra.data.data || [],
        usuarios: usuarios.data.data || [],
        empresas: empresas.data.data || [],
        edificios: edificios.data.data || [],
        contactosEmpresa: [],
      });
    } catch (error) {
      console.error(`Error al obtener los catálogos - ${error}`);
      setError("Error al cargar los catálogos");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga contactos específicos de una empresa
   * @param {number} idEmpresa - ID de la empresa
   */
  const fetchContactosEmpresa = useCallback(async (idEmpresa) => {
    try {
      const res = await apiClient.get(
        `${API_ENDPOINTS.CONTACTO}?idEmpresa=${idEmpresa}`,
      );
      setCatalogos((prev) => ({
        ...prev,
        contactosEmpresa: res.data.data || [],
      }));
    } catch (error) {
      console.error(`Error al obtener los contactos de la empresa - ${error}`);
    }
  }, []);

  /**
   * Limpia los contactos
   */
  const clearContactos = useCallback(() => {
    setCatalogos((prev) => ({
      ...prev,
      contactosEmpresa: [],
    }));
  }, []);

  // Cargar catálogos al montarse
  useEffect(() => {
    fetchCatalogos();
  }, [fetchCatalogos]);

  return {
    catalogos,
    loading,
    error,
    fetchContactosEmpresa,
    clearContactos,
    refetchCatalogos: fetchCatalogos,
  };
};
