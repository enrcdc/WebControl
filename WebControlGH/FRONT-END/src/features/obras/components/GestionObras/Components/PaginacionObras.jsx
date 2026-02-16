// COMPONENTE JSX RELATIVO A LA PAGINACIÓN DE OBRAS

import React from "react";
import { Pagination } from "react-bootstrap";

const PaginacionObras = ({
  currentPage,
  totalPaginas,
  paginasVisibles,
  startPage,
  endPage,
  onPageChange,
}) => {
  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} />
      {startPage > 1 && (
        <Pagination.Prev onClick={() => onPageChange(startPage - 1)} />
      )}
      {paginasVisibles.map((page) => (
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

export default PaginacionObras;
