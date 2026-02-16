// components/ObrasList/index.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import "../../../../css/ObrasList.css";

// Hooks personalizados
import { useObrasLista } from "../../hooks/useObrasLista";
import { useFiltrosObras } from "../../hooks/useFiltrosObras";
import { useObrasEspeciales } from "../../hooks/useObrasEspeciales";
import { useOperacionesObras } from "../../hooks/useOperacionesObras";
import { usePaginacion } from "../../hooks/usePaginacion";

// Componentes
import AlertasObras from "./Components/AlertasObras";
import FiltrosObras from "./Components/FiltrosObras";
import BarraBusqueda from "./Components/BarraBusqueda";
import BarraAcciones from "./Components/BarraAcciones";
import TablaObras from "./Components/TablaObras";
import PaginacionObras from "./Components/PaginacionObras";

const ListaObras = () => {
  const navigate = useNavigate();

  // Hook principal: estado de obras
  const {
    allObras,
    filteredObras,
    selectedObras,
    selectAll,
    loading,
    error,
    catalogos,
    setFilteredObras,
    fetchObras,
    handleSelectObra,
    handleSelectAll,
    clearSelections,
  } = useObrasLista();

  // Hook de filtros
  const {
    formData,
    searchTerm,
    setSearchTerm,
    handleChangeForm,
    handleSearch,
  } = useFiltrosObras(allObras, setFilteredObras);

  // Hook de obras especiales (alertas)
  const obrasEspecialesHook = useObrasEspeciales(allObras);

  // Hook de paginación
  const {
    currentPage,
    setCurrentPage,
    obrasActuales,
    totalPaginas,
    startPage,
    endPage,
    paginasVisibles,
    handlePageChange,
  } = usePaginacion(filteredObras);

  // Hook de operaciones CRUD
  const {
    handleAgregarObra,
    handleFinalizarObra,
    handleBajaObras,
    handleCopiarObras,
    handleImprimirObras,
  } = useOperacionesObras(fetchObras, clearSelections, setCurrentPage);

  // Aplicar filtros guardados solo cuando se cargan las obras por primera vez
  useEffect(() => {
    if (allObras.length > 0) {
      handleSearch(allObras);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allObras.length]);

  // Handlers para navegación
  const handleVerDetalle = (idObra) => {
    navigate(`/home/gestion-obras/detalle/${idObra}`);
  };

  const handleFinalizarConLimpieza = async (idObra) => {
    await handleFinalizarObra(idObra, () => {
      obrasEspecialesHook.setObraFacturadaSelec(null);
    });
  };

  // Handler para búsqueda con reset de página
  const handleBuscarConReset = () => {
    setCurrentPage(1);
    handleSearch();
  };

  // Manejo de errores
  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <div className="obras-list">
      {/* Alertas de Obras Especiales */}
      <AlertasObras
        obrasSuperadas={obrasEspecialesHook.obrasSuperadas}
        obrasFacturadas={obrasEspecialesHook.obrasFacturadas}
        obrasSeguimiento={obrasEspecialesHook.obrasSeguimiento}
        obrasSinPedidosConHoras={obrasEspecialesHook.obrasSinPedidosConHoras}
        obraSuperadaSelec={obrasEspecialesHook.obraSuperadaSelec}
        setObraSuperadaSelec={obrasEspecialesHook.setObraSuperadaSelec}
        obraFacturadaSelec={obrasEspecialesHook.obraFacturadaSelec}
        setObraFacturadaSelec={obrasEspecialesHook.setObraFacturadaSelec}
        obraSeguimientoSelec={obrasEspecialesHook.obraSeguimientoSelec}
        setObraSeguimientoSelec={obrasEspecialesHook.setObraSeguimientoSelec}
        obraSinPedidosConHorasSelec={
          obrasEspecialesHook.obraSinPedidosConHorasSelec
        }
        setObraSinPedidosConHorasSelec={
          obrasEspecialesHook.setObraSinPedidosConHorasSelec
        }
        onVerDetalle={handleVerDetalle}
        onFinalizar={handleFinalizarConLimpieza}
      />

      {/* Filtros de Búsqueda */}
      <FiltrosObras
        formData={formData}
        catalogos={catalogos}
        onChangeForm={handleChangeForm}
      />

      {/* Barra de Búsqueda y Acciones */}
      <Container>
        <Row className="align-items-center mb-3">
          <BarraBusqueda
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleBuscarConReset}
          />
          <BarraAcciones
            onAgregar={handleAgregarObra}
            onBaja={() => handleBajaObras(selectedObras)}
            onCopiar={() => handleCopiarObras(selectedObras, allObras)}
            onImprimir={() => handleImprimirObras(selectedObras)}
          />
        </Row>
      </Container>

      {/* Tabla de Obras */}
      <TablaObras
        obras={obrasActuales}
        selectedObras={selectedObras}
        selectAll={selectAll}
        loading={loading}
        onSelectObra={handleSelectObra}
        onSelectAll={() => handleSelectAll(filteredObras)}
        onVerDetalle={handleVerDetalle}
      />

      {/* Paginación */}
      <PaginacionObras
        currentPage={currentPage}
        totalPaginas={totalPaginas}
        paginasVisibles={paginasVisibles}
        startPage={startPage}
        endPage={endPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ListaObras;
