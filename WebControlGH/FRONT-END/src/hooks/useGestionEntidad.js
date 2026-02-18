import { useState, useEffect, useCallback } from "react";
import { useServerPagination } from "./useServerPagination";

/**
 * Hook genérico para gestión de entidades con paginación server-side.
 *
 * Uso: el componente crea `fetchFunction` con useCallback capturando sus filtros.
 * El hook la llama automáticamente al cambiar fetchFunction, página o refreshKey.
 *
 * @param {Function} fetchFunction - useCallback del componente. Recibe { limit, offset }.
 * @param {number} pageSize - Registros por página (default 20)
 *
 * @example
 * const fetchComplejos = useCallback(
 *   ({ limit, offset }) => complejoService.getAll({ limit, offset, nombre: searchTerm }),
 *   [searchTerm]
 * );
 * const { items, loading, error, setError, pagination, refreshData } =
 *   useGestionEntidad(fetchComplejos, 20);
 */
export const useGestionEntidad = (fetchFunction, pageSize = 20) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const pagination = useServerPagination(total, pageSize);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchFunction({
          limit: pagination.limit,
          offset: pagination.offset,
        });
        setItems(res.data.data);
        setTotal(res.data.pagination?.total ?? 0);
      } catch (err) {
        if (err.response?.status === 404) {
          setItems([]);
          setTotal(0);
        } else {
          setError("Error al obtener los datos");
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [fetchFunction, pagination.limit, pagination.offset, refreshKey]);

  const refreshData = useCallback(() => setRefreshKey((k) => k + 1), []);

  return {
    items,
    total,
    loading,
    error,
    setError,
    pagination,
    refreshData,
  };
};
