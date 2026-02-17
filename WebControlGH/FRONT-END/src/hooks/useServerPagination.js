import { useState, useMemo } from "react";

const MAX_PAGINAS_VISIBLES = 10;

/**
 * Hook para paginación server-side.
 * El backend controla los datos con LIMIT/OFFSET y devuelve el total.
 * Este hook gestiona el estado de la página y calcula limit/offset para enviar al backend.
 *
 * @param {number} total - Total de registros (viene del backend: pagination.total)
 * @param {number} defaultLimit - Registros por página (default 50)
 * @returns {{ currentPage, totalPaginas, limit, offset, handlePageChange, resetToFirstPage, startPage, endPage, paginasVisibles }}
 */
export const useServerPagination = (total = 0, defaultLimit = 50) => {
  const [currentPage, setCurrentPage] = useState(1);

  const limit = defaultLimit;
  const offset = (currentPage - 1) * limit;

  const paginacionData = useMemo(() => {
    const totalPaginas =
      limit > 0 && total > 0 ? Math.ceil(total / limit) : 1;

    const startPage =
      Math.floor((currentPage - 1) / MAX_PAGINAS_VISIBLES) *
        MAX_PAGINAS_VISIBLES +
      1;
    const endPage = Math.min(
      startPage + MAX_PAGINAS_VISIBLES - 1,
      totalPaginas,
    );

    const paginasVisibles = [];
    for (let i = startPage; i <= endPage; i++) {
      paginasVisibles.push(i);
    }

    return { totalPaginas, startPage, endPage, paginasVisibles };
  }, [total, limit, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPaginas: paginacionData.totalPaginas,
    limit,
    offset,
    startPage: paginacionData.startPage,
    endPage: paginacionData.endPage,
    paginasVisibles: paginacionData.paginasVisibles,
    handlePageChange,
    resetToFirstPage,
  };
};
