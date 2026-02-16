// Hook refactorizado para gestión de lista de obras
import { useState, useEffect, useCallback } from "react";
import { useSeleccionMultiple } from "./useSeleccionMultiple.js";
import { obraService } from "../services/obra.service.js";
import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

// TODO: Dependencias cross-feature — tipoObra, estadoObra, empresa, edificio se migrarán a sus features propias

/**
 * Hook para gestión de lista de obras
 * Refactorizado usando useSeleccionMultiple
 *
 * @returns {Object} Estado y funciones para gestionar lista de obras
 */
export const useObrasLista = () => {
  // Estados principales
  const [allObras, setAllObras] = useState([]);
  const [filteredObras, setFilteredObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para catálogos/desplegables
  const [catalogos, setCatalogos] = useState({
    tiposObra: [],
    estadosObra: [],
    empresas: [],
    edificios: [],
  });

  // Hook de selección múltiple
  const seleccion = useSeleccionMultiple("id_obra");

  /**
   * Fetch de todas las obras
   */
  const fetchObras = useCallback(async () => {
    try {
      setLoading(true);
      const response = await obraService.getAll();
      const obras = response.data.data;

      setAllObras(obras);
      // No establecer filteredObras aquí - se aplicarán los filtros en el useEffect

      return obras;
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${
            error.response.data.error ||
            "Error al cargar los detalles de las obras."
          }`
        );
      } else if (error.request) {
        setError("Error en la solicitud al servidor.");
      } else {
        setError("Error desconocido al cargar los detalles de las obras");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch de catálogos/desplegables
   */
  const fetchCatalogos = useCallback(async () => {
    try {
      const [tiposObra, estadosObra, empresas, edificios] = await Promise.all([
        apiClient.get(API_ENDPOINTS.TIPO_OBRA),
        apiClient.get(API_ENDPOINTS.ESTADO_OBRA),
        apiClient.get(API_ENDPOINTS.EMPRESA),
        apiClient.get(API_ENDPOINTS.EDIFICIO),
      ]);

      setCatalogos({
        tiposObra: tiposObra.data.data,
        estadosObra: estadosObra.data.data,
        empresas: empresas.data.data,
        edificios: edificios.data.data,
      });
    } catch (error) {
      console.error(`Error al obtener los catálogos - ${error}`);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchObras();
    fetchCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Estados de obras
    allObras,
    filteredObras,
    loading,
    error,
    catalogos,

    // Setters
    setFilteredObras,
    setSelectedObras: seleccion.setSelections,

    // Funciones
    fetchObras,

    // Selección (del hook useSeleccionMultiple)
    selectedObras: seleccion.selected,
    selectAll: seleccion.selectAll,
    handleSelectObra: seleccion.handleSelect,
    handleSelectAll: () => seleccion.handleSelectAll(filteredObras),
    clearSelections: seleccion.clearSelections,
    isSelected: seleccion.isSelected,
    hasSelection: seleccion.hasSelection,
  };
};
