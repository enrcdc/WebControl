// hooks/usePaginacion.js -> Paginación client-side
import { useMemo } from "react";
import { useSessionStorage } from "./useSessionStorage.js";

export const usePaginacion = (filteredItems, itemsPorPag = 10) => {
  // Estado de la pagina actual (persistido en sessionStorage)
  const [currentPage, setCurrentPage] = useSessionStorage("currentPage", 1);

  // Constantes de paginacion
  const itemsPorPagina = itemsPorPag;
  const maxPaginasVisibles = 10;

  const paginacionData = useMemo(() => {
    // Indices de inicio y fin de los items a mostrar en la pagina actual
    const indexOfLastItem = currentPage * itemsPorPagina;
    const indexOfFirstItem = indexOfLastItem - itemsPorPagina;

    // Items a mostrar en la pagina actual
    const itemsActuales = filteredItems.slice(
      indexOfFirstItem,
      indexOfLastItem,
    );

    // Numero total de paginas
    const totalPaginas = Math.ceil(filteredItems.length / itemsPorPagina);

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
      itemsActuales,
      totalPaginas,
      startPage,
      endPage,
      paginasVisibles,
      indexOfFirstItem,
      indexOfLastItem,
    };
  }, [filteredItems, currentPage, itemsPorPagina, maxPaginasVisibles]);

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
    itemsActuales: paginacionData.itemsActuales,
    totalPaginas: paginacionData.totalPaginas,
    startPage: paginacionData.startPage,
    endPage: paginacionData.endPage,
    paginasVisibles: paginacionData.paginasVisibles,

    // Funciones
    handlePageChange,
    resetToFirstPage,
  };
};
