// Hook atómico para gestionar llamadas API genéricas con loading/error
import { useState, useCallback } from "react";

/**
 * Hook genérico para manejar peticiones HTTP con estados de loading y error
 *
 * @returns {Object} Estado y funciones para ejecutar peticiones
 * @property {any} data - Datos retornados por la petición
 * @property {boolean} loading - Estado de carga
 * @property {string|null} error - Mensaje de error si existe
 * @property {Function} execute - Función para ejecutar la petición
 * @property {Function} reset - Función para resetear el estado
 *
 * @example
 * const { data, loading, error, execute } = useApiRequest();
 *
 * const cargarDatos = async () => {
 *   const resultado = await execute(() => obraService.getObra(id));
 *   if (resultado) {
 *     console.log('Datos cargados:', resultado);
 *   }
 * };
 */
export const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Ejecuta una función asíncrona (llamada API) y gestiona sus estados
   * @param {Function} apiFunction - Función async que retorna una promesa
   * @param {Object} options - Opciones de configuración
   * @param {Function} options.onSuccess - Callback opcional al completar con éxito
   * @param {Function} options.onError - Callback opcional al fallar
   * @returns {Promise<any>} Los datos retornados o null si hay error
   */
  const execute = useCallback(async (apiFunction, options = {}) => {
    const { onSuccess, onError } = options;

    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction();
      const result = response?.data?.data || response?.data || response;

      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Error desconocido";

      setError(errorMessage);
      console.error("Error en petición API:", err);

      if (onError) {
        onError(err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resetea el estado a su valor inicial
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};
