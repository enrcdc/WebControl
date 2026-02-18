// Hook atómico para búsqueda genérica con sugerencias
import { useState, useCallback, useRef } from "react";

/**
 * Hook genérico para búsqueda de entidades con sugerencias
 * Útil para búsquedas de obras, productos, facturas, etc.
 *
 * @param {Function} buscarFunction - Función async que realiza la búsqueda
 * @param {Object} options - Opciones de configuración
 * @param {number} options.minLength - Mínimo de caracteres para buscar (default: 3)
 * @param {string} options.keyField - Campo ID para filtrar duplicados (default: "id")
 * @returns {Object} Estado y funciones de búsqueda
 *
 * @example
 * const {
 *   busqueda,
 *   sugerencias,
 *   entidadSeleccionada,
 *   handleBuscar,
 *   seleccionar,
 *   eliminarSeleccion,
 *   limpiar
 * } = useBusquedaEntidad(
 *   (termino) => obraService.buscarObrasPorDescripcion(termino),
 *   { minLength: 2 }
 * );
 */
export const useBusquedaEntidad = (buscarFunction, options = {}) => {
  const { minLength = 3, keyField = "id" } = options;

  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  /**
   * Maneja el cambio en el campo de búsqueda
   * @param {Event} e - Evento del input
   */
  const handleBuscar = useCallback(
    async (e) => {
      const value = e.target.value;
      const currentRef = ++requestRef.current;

      setBusqueda(value);

      if (value.length >= minLength) {
        try {
          setLoading(true);
          const res = await buscarFunction(value);

          if (currentRef !== requestRef.current) return;

          const datos = res?.data?.data || res?.data || [];

          // Filtrar items ya seleccionados
          const idSeleccionado = entidadSeleccionada
            ? entidadSeleccionada[keyField]
            : "";
          setSugerencias(datos.filter((d) => d[keyField] !== idSeleccionado));
        } catch (error) {
          console.error(`Error al buscar entidad - ${error}`);
          setSugerencias([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSugerencias([]);
      }
    },
    [buscarFunction, minLength],
  );

  /**
   * Selecciona una entidad de las sugerencias
   * @param {Object} entidad - Entidad seleccionada
   */
  const seleccionar = useCallback((entidad) => {
    setEntidadSeleccionada(entidad);
    setBusqueda("");
    setSugerencias([]);
  }, []);

  /**
   * Elimina la selección actual
   */
  const eliminarSeleccion = useCallback(() => {
    setEntidadSeleccionada(null);
  }, []);

  /**
   * Limpia todo el estado de búsqueda
   */
  const limpiar = useCallback(() => {
    setBusqueda("");
    setSugerencias([]);
    setEntidadSeleccionada(null);
    setLoading(false);
  }, []);

  /**
   * Actualiza manualmente el término de búsqueda
   * @param {string} termino - Término de búsqueda
   */
  const setBusquedaManual = useCallback((termino) => {
    setBusqueda(termino);
  }, []);

  return {
    busqueda,
    sugerencias,
    entidadSeleccionada,
    loading,
    handleBuscar,
    seleccionar,
    eliminarSeleccion,
    limpiar,
    setBusqueda: setBusquedaManual,
    setEntidadSeleccionada, // Por si se necesita setear externamente
  };
};
