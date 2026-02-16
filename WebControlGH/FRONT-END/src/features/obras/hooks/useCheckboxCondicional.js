// Hook atómico para checkbox que afecta otros campos del formulario
import { useState, useCallback } from "react";

/**
 * Hook para gestionar un checkbox que ejecuta acciones cuando cambia su estado
 * Útil para checkboxes como "Ofertado", "En Seguimiento", etc. que afectan otros campos
 *
 * @param {boolean} initialValue - Valor inicial del checkbox
 * @param {Function} onCheck - Función a ejecutar cuando se marca (opcional)
 * @param {Function} onUncheck - Función a ejecutar cuando se desmarca (opcional)
 * @returns {Object} Estado y funciones del checkbox
 *
 * @example
 * // Ejemplo: Checkbox "Ofertado" que limpia fecha cuando se desmarca
 * const { checked, handleToggle } = useCheckboxCondicional(
 *   false,
 *   () => console.log('Se marcó como ofertado'),
 *   () => setFormData(prev => ({ ...prev, fechaOferta: '' }))
 * );
 *
 * <input type="checkbox" checked={checked} onChange={handleToggle} />
 */
export const useCheckboxCondicional = (
  initialValue = false,
  onCheck = null,
  onUncheck = null
) => {
  const [checked, setChecked] = useState(initialValue);

  /**
   * Alterna el estado del checkbox y ejecuta las funciones correspondientes
   */
  const handleToggle = useCallback(() => {
    setChecked((prev) => {
      const nuevoValor = !prev;

      // Ejecutar callback correspondiente
      if (nuevoValor && onCheck) {
        onCheck();
      } else if (!nuevoValor && onUncheck) {
        onUncheck();
      }

      return nuevoValor;
    });
  }, [onCheck, onUncheck]);

  /**
   * Establece el checkbox a un valor específico
   * @param {boolean} value - Nuevo valor del checkbox
   * @param {boolean} executeCallbacks - Si debe ejecutar los callbacks (default: true)
   */
  const setValue = useCallback(
    (value, executeCallbacks = true) => {
      setChecked(value);

      if (executeCallbacks) {
        if (value && onCheck) {
          onCheck();
        } else if (!value && onUncheck) {
          onUncheck();
        }
      }
    },
    [onCheck, onUncheck]
  );

  /**
   * Marca el checkbox
   */
  const check = useCallback(() => {
    setValue(true);
  }, [setValue]);

  /**
   * Desmarca el checkbox
   */
  const uncheck = useCallback(() => {
    setValue(false);
  }, [setValue]);

  return {
    checked,
    handleToggle,
    setValue,
    check,
    uncheck,
  };
};
