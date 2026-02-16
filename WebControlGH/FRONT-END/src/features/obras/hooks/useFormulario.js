// Hook atómico para gestión genérica de formularios
import { useState, useCallback } from "react";

/**
 * Hook genérico para gestionar el estado de formularios
 *
 * @param {Object} initialForm - Valores iniciales del formulario
 * @param {Array<string>} camposNumericos - Array de nombres de campos que deben ser numéricos
 * @returns {Object} Estado y funciones del formulario
 *
 * @example
 * const { formData, handleChange, resetForm, setFormData } = useFormulario(
 *   { nombre: '', edad: 0, activo: false },
 *   ['edad']
 * );
 */
export const useFormulario = (initialForm = {}, camposNumericos = []) => {
  const [formData, setFormData] = useState(initialForm);

  /**
   * Maneja cambios en los campos del formulario
   * Soporta inputs de tipo text, number, checkbox, select, etc.
   *
   * @param {Event} e - Evento del input
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      setFormData((prev) => {
        // Checkbox
        if (type === "checkbox") {
          return { ...prev, [name]: checked };
        }

        // Campos numéricos
        if (camposNumericos.includes(name)) {
          return { ...prev, [name]: Number(value) };
        }

        // Campos de texto y otros
        return { ...prev, [name]: value };
      });
    },
    [camposNumericos]
  );

  /**
   * Actualiza múltiples campos del formulario a la vez
   *
   * @param {Object} updates - Objeto con los campos a actualizar
   * @example
   * updateFields({ nombre: 'Juan', edad: 25 })
   */
  const updateFields = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Actualiza un solo campo del formulario
   *
   * @param {string} name - Nombre del campo
   * @param {any} value - Valor del campo
   * @example
   * updateField('nombre', 'Juan')
   */
  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Resetea el formulario a sus valores iniciales
   */
  const resetForm = useCallback(() => {
    setFormData(initialForm);
  }, [initialForm]);

  /**
   * Resetea el formulario a valores personalizados
   * @param {Object} newValues - Nuevos valores para el formulario
   */
  const resetFormTo = useCallback((newValues) => {
    setFormData(newValues);
  }, []);

  /**
   * Obtiene el valor de un campo específico
   * @param {string} fieldName - Nombre del campo
   * @returns {any} Valor del campo
   */
  const getFieldValue = useCallback(
    (fieldName) => {
      return formData[fieldName];
    },
    [formData]
  );

  return {
    formData,
    handleChange,
    updateFields,
    updateField,
    resetForm,
    resetFormTo,
    setFormData,
    getFieldValue,
  };
};
