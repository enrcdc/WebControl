// Hook atómico para gestión de selección múltiple (checkboxes)
import { useState, useCallback } from "react";

/**
 * Hook genérico para gestionar selección múltiple de items
 * Útil para tablas con checkboxes, selección de obras, etc.
 *
 * @param {string} idField - Nombre del campo ID en los items (default: 'id')
 * @returns {Object} Estado y funciones de selección
 *
 * @example
 * const {
 *   selected,
 *   selectAll,
 *   handleSelect,
 *   handleSelectAll,
 *   clearSelections,
 *   isSelected,
 *   getSelectedCount
 * } = useSeleccionMultiple('id_obra');
 *
 * // En un checkbox
 * <input
 *   type="checkbox"
 *   checked={isSelected(obra.id_obra)}
 *   onChange={() => handleSelect(obra.id_obra)}
 * />
 */
export const useSeleccionMultiple = (idField = "id") => {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  /**
   * Selecciona o deselecciona un item individual
   * @param {number|string} id - ID del item
   */
  const handleSelect = useCallback((id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  }, []);

  /**
   * Selecciona o deselecciona todos los items
   * @param {Array} items - Array de items a seleccionar
   */
  const handleSelectAll = useCallback(
    (items) => {
      setSelectAll((prev) => !prev);

      if (!selectAll) {
        // Seleccionar todos
        const allIds = items.map((item) => item[idField]);
        setSelected(allIds);
      } else {
        // Deseleccionar todos
        setSelected([]);
      }
    },
    [selectAll, idField]
  );

  /**
   * Limpia todas las selecciones
   */
  const clearSelections = useCallback(() => {
    setSelected([]);
    setSelectAll(false);
  }, []);

  /**
   * Verifica si un item está seleccionado
   * @param {number|string} id - ID del item
   * @returns {boolean} true si está seleccionado
   */
  const isSelected = useCallback(
    (id) => {
      return selected.includes(id);
    },
    [selected]
  );

  /**
   * Retorna la cantidad de items seleccionados
   * @returns {number} Cantidad de items seleccionados
   */
  const getSelectedCount = useCallback(() => {
    return selected.length;
  }, [selected]);

  /**
   * Verifica si hay algún item seleccionado
   * @returns {boolean} true si hay al menos un item seleccionado
   */
  const hasSelection = useCallback(() => {
    return selected.length > 0;
  }, [selected]);

  /**
   * Establece manualmente las selecciones
   * @param {Array} ids - Array de IDs a seleccionar
   */
  const setSelections = useCallback((ids) => {
    setSelected(ids);
    setSelectAll(false);
  }, []);

  return {
    selected,
    selectAll,
    handleSelect,
    handleSelectAll,
    clearSelections,
    isSelected,
    getSelectedCount,
    hasSelection,
    setSelections,
  };
};
