// hooks/usePaginacion.js
import { useMemo } from "react";
import { useSessionStorage } from "./useSessionStorage.js";

export const usePaginacion = (filteredObras, itemsPorPagina = 10) => {
  // Estado de la pagina actual (persistido en sessionStorage)
  const [currentPage, setCurrentPage] = useSessionStorage("currentPage", 1);

  // Constantes de paginacion
  const obrasPorPagina = itemsPorPagina;
  const maxPaginasVisibles = 10;

  const paginacionData = useMemo(() => {
    // Indices de inicio y fin de las obras a mostrar en la pagina actual
    const indexOfLastObra = currentPage * obrasPorPagina;
    const indexOfFirstObra = indexOfLastObra - obrasPorPagina;

    // Obras a mostrar en la pagina actual
    const obrasActuales = filteredObras.slice(
      indexOfFirstObra,
      indexOfLastObra
    );

    // Numero total de paginas
    const totalPaginas = Math.ceil(filteredObras.length / obrasPorPagina);

    // Calcular el rango de paginas a mostrar (1-10, 11-20, 21-30, ...)
    const startPage =
      Math.floor((currentPage - 1) / maxPaginasVisibles) * maxPaginasVisibles +
      1;
    const endPage = Math.min(startPage + maxPaginasVisibles - 1, totalPaginas);

    // Generar array de paginas visibles
    const paginasVisibles = [];
    for (let i = startPage; i <= endPage; i++) {
      paginasVisibles.push(i);
    }

    return {
      obrasActuales,
      totalPaginas,
      startPage,
      endPage,
      paginasVisibles,
      indexOfFirstObra,
      indexOfLastObra,
    };
  }, [filteredObras, currentPage, obrasPorPagina, maxPaginasVisibles]);

  // Funcion para manejar el cambio de pagina
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Resetear a la primera pagina
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    // Estado actual
    currentPage,
    setCurrentPage,

    // Datos calculados
    obrasActuales: paginacionData.obrasActuales,
    totalPaginas: paginacionData.totalPaginas,
    startPage: paginacionData.startPage,
    endPage: paginacionData.endPage,
    paginasVisibles: paginacionData.paginasVisibles,

    // Funciones
    handlePageChange,
    resetToFirstPage,
  };
};
