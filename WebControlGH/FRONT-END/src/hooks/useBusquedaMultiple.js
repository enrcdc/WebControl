// Hook atómico para búsqueda con selección múltiple
import { useState, useCallback, useRef } from "react";

/**
 * Hook genérico para búsqueda de entidades con selección múltiple.
 * Compatible con SearchableMultiSelect:
 *   value → busqueda
 *   onChange → handleBuscar
 *   suggestions → sugerencias (auto-filtra seleccionados)
 *   onSelect → seleccionar
 *   selectedItems → seleccionados
 *   onRemove → remover
 *
 * @param {Function} buscarFunction - Función async de búsqueda. Recibe el término, retorna respuesta axios.
 * @param {Object} options - Opciones de configuración
 * @param {number} options.minLength - Mínimo de caracteres para buscar (default: 2)
 * @param {string} options.keyField - Campo ID para filtrar duplicados (default: "id")
 * @returns {Object} Estado y funciones de búsqueda + selección múltiple
 *
 * @example
 * const contactos = useBusquedaMultiple(
 *   (nombre) => apiClient.get(API_ENDPOINTS.CONTACTO, { params: { nombre, limit: 10 } }),
 *   { minLength: 2 }
 * );
 *
 * <SearchableMultiSelect
 *   value={contactos.busqueda}
 *   onChange={contactos.handleBuscar}
 *   suggestions={contactos.sugerencias}
 *   onSelect={contactos.seleccionar}
 *   selectedItems={contactos.seleccionados}
 *   onRemove={contactos.remover}
 *   ...
 * />
 */
export const useBusquedaMultiple = (buscarFunction, options = {}) => {
  const { minLength = 2, keyField = "id" } = options;

  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  /**
   * Maneja el cambio en el campo de búsqueda.
   * Filtra automáticamente los items ya seleccionados de las sugerencias.
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
          const idsSeleccionados = seleccionados.map((s) => s[keyField]);
          setSugerencias(
            datos.filter((d) => !idsSeleccionados.includes(d[keyField])),
          );
        } catch {
          setSugerencias([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSugerencias([]);
      }
    },
    [buscarFunction, minLength, seleccionados, keyField],
  );

  /**
   * Añade un item a la lista de seleccionados y limpia la búsqueda
   */
  const seleccionar = useCallback((item) => {
    setSeleccionados((prev) => [...prev, item]);
    setBusqueda("");
    setSugerencias([]);
  }, []);

  /**
   * Elimina un item de la lista de seleccionados
   */
  const remover = useCallback(
    (item) => {
      setSeleccionados((prev) =>
        prev.filter((s) => s[keyField] !== item[keyField]),
      );
    },
    [keyField],
  );

  /**
   * Limpia todo el estado (búsqueda, sugerencias, seleccionados)
   */
  const limpiar = useCallback(() => {
    setBusqueda("");
    setSugerencias([]);
    setSeleccionados([]);
  }, []);

  return {
    busqueda,
    sugerencias,
    seleccionados,
    loading,
    handleBuscar,
    seleccionar,
    remover,
    limpiar,
    setSeleccionados,
  };
};
