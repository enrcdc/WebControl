// Hook atómico para gestionar la carga de catálogos/desplegables
import { useState, useEffect, useCallback } from "react";
import { obraService } from "../../Services/obraService.js";
import { tipoObraService } from "../../Services/tipoObraService.js";
import { tipoFacturableService } from "../../Services/tipoFacturableService.js";
import { estadoObraService } from "../../Services/estadoObraService.js"
import { usuarioService } from "../../Services/usuarioService.js"
import { empresaService } from "../../Services/empresaService.js"
import { edificioService } from "../../Services/edificioService.js"
import { contactoService } from "../../Services/contactoService.js"



/**
 * Hook para cargar y gestionar catálogos/desplegables
 * Carga todos los catálogos comunes de obras al montarse
 *
 * @returns {Object} Estado y funciones de catálogos
 * @property {Object} catalogos - Objeto con todos los catálogos
 * @property {boolean} loading - Estado de carga
 * @property {string|null} error - Mensaje de error si existe
 * @property {Function} fetchContactosEmpresa - Función para cargar contactos de una empresa
 * @property {Function} refetchCatalogos - Función para recargar catálogos
 *
 * @example
 * const { catalogos, loading, fetchContactosEmpresa } = useCatalogosBase();
 *
 * // Acceder a catálogos
 * catalogos.tiposObra.map(tipo => ...)
 *
 * // Cargar contactos cuando cambia la empresa
 * useEffect(() => {
 *   if (empresaId) {
 *     fetchContactosEmpresa(empresaId);
 *   }
 * }, [empresaId]);
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
        tipoObraService.getTiposObra(),
        tipoFacturableService.getTiposFacturables(),
        estadoObraService.getEstadosObra(),
        usuarioService.getUsuarios(),
        empresaService.getEmpresas(),
        edificioService.getEdificios(),
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
      const res = await contactoService.getContactosEmpresa(idEmpresa);
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
    refetchCatalogos: fetchCatalogos, // Alias para recargar
  };
};
