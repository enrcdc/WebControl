import React from "react";
import { Pagination } from "react-bootstrap";

/**
 * Componente de paginación reutilizable.
 *
 * Uso básico (con usePaginacion hook):
 *   <PaginationControl
 *     currentPage={currentPage}
 *     totalPaginas={totalPaginas}
 *     paginasVisibles={paginasVisibles}
 *     startPage={startPage}
 *     endPage={endPage}
 *     onPageChange={handlePageChange}
 *   />
 *
 * Modo simple (solo números, sin First/Last/Prev/Next):
 *   <PaginationControl
 *     currentPage={currentPage}
 *     totalPaginas={totalPaginas}
 *     onPageChange={handlePageChange}
 *     simple
 *   />
 */
const PaginationControl = ({
  currentPage,
  totalPaginas,
  paginasVisibles,
  startPage,
  endPage,
  onPageChange,
  simple = false,
}) => {
  if (totalPaginas <= 1) return null;

  // Modo simple: renderizar todos los números directamente
  if (simple) {
    return (
      <Pagination>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  }

  // Modo completo: ventana de páginas con navegación First/Prev/Next/Last
  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} />
      {startPage > 1 && (
        <Pagination.Prev onClick={() => onPageChange(startPage - 1)} />
      )}
      {(paginasVisibles || []).map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      {endPage < totalPaginas && (
        <Pagination.Next onClick={() => onPageChange(endPage + 1)} />
      )}
      <Pagination.Last onClick={() => onPageChange(totalPaginas)} />
    </Pagination>
  );
};

export default PaginationControl;
