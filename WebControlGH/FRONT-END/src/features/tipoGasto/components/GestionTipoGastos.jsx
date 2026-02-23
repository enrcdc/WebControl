import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { tipoGastoService } from "../services/tipoGasto.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple";
import { SearchableMultiSelect, PaginationControl } from "Components/ui";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

function GestionTipoGastos() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarBaja, setMostrarBaja] = useState(false);

  const {
    selected,
    handleSelect,
    handleSelectAll,
    clearSelections,
    isSelected,
  } = useSeleccionMultiple();

  // Filtro multi-IVA
  const tipoIvaFiltro = useBusquedaMultiple(
    () => apiClient.get(API_ENDPOINTS.TIPO_IVA),
    { minLength: 1 },
  );

  const fetchTiposGasto = useCallback(
    ({ limit, offset }) =>
      tipoGastoService.filtrar({
        limit,
        offset,
        ...(searchTerm && { descripcion: searchTerm }),
        ...(tipoIvaFiltro.seleccionados.length > 0 && {
          idsIva: tipoIvaFiltro.seleccionados.map((t) => t.id),
        }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, tipoIvaFiltro.seleccionados, mostrarBaja],
  );

  const {
    items: tiposGasto,
    loading,
    error,
    setError,
    pagination,
    refreshData,
  } = useGestionEntidad(fetchTiposGasto, 20);

  // -- Búsqueda --
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    pagination.resetToFirstPage();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    pagination.resetToFirstPage();
  };

  // -- Filtros --
  const handleMostrarBajaChange = (e) => {
    setMostrarBaja(e.target.checked);
    pagination.resetToFirstPage();
  };

  const handleIvaSelect = (tipoIva) => {
    tipoIvaFiltro.seleccionar(tipoIva);
    pagination.resetToFirstPage();
  };

  const handleIvaRemove = (tipoIva) => {
    tipoIvaFiltro.remover(tipoIva);
    pagination.resetToFirstPage();
  };

  // -- Acciones --
  const handleBajaTiposGasto = async () => {
    if (selected.length === 0)
      return alert("Selecciona al menos un tipo de gasto");
    if (!window.confirm(`¿Dar de baja ${selected.length} tipo(s) de gasto?`))
      return;
    try {
      await tipoGastoService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja los tipos de gasto");
    }
  };

  // -- Render --
  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Tipos de Gasto</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button onClick={() => navigate("/home/nuevo-tipo-gasto")}>
          Nuevo Tipo de Gasto
        </Button>
        <Button variant="danger" onClick={handleBajaTiposGasto}>
          Baja Tipo de Gasto
        </Button>
      </div>

      {/* Búsqueda + Filtros */}
      <Form onSubmit={handleSearch} className="mb-3">
        <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
          <Form.Control
            type="text"
            placeholder="Buscar por descripción..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
          <Button type="submit" variant="primary">
            Buscar
          </Button>
          {searchTerm && (
            <Button variant="outline-secondary" onClick={handleClearSearch}>
              Limpiar
            </Button>
          )}
          <Form.Check
            type="checkbox"
            label="Mostrar dados de Baja"
            checked={mostrarBaja}
            onChange={handleMostrarBajaChange}
            className="ms-2"
          />
        </div>

        {/* Filtro multi-IVA */}
        <div style={{ maxWidth: "500px" }}>
          <Form.Label className="mb-1 text-white">
            Filtrar por tipo de IVA
          </Form.Label>
          <SearchableMultiSelect
            placeholder="Buscar tipo de IVA..."
            value={tipoIvaFiltro.busqueda}
            onChange={tipoIvaFiltro.handleBuscar}
            suggestions={tipoIvaFiltro.sugerencias}
            onSelect={handleIvaSelect}
            renderSuggestion={(t) =>
              `${t.descripcion}${t.porcentaje != null ? ` (${t.porcentaje}%)` : ""}`
            }
            keyField="id"
            selectedItems={tipoIvaFiltro.seleccionados}
            renderSelected={(t) =>
              `${t.descripcion}${t.porcentaje != null ? ` (${t.porcentaje}%)` : ""}`
            }
            onRemove={handleIvaRemove}
          />
        </div>
      </Form>

      {/* Tabla */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <Form.Check
                    type="checkbox"
                    checked={
                      selected.length === tiposGasto.length &&
                      tiposGasto.length > 0
                    }
                    onChange={() => handleSelectAll(tiposGasto)}
                  />
                </th>
                <th>Etiqueta</th>
                <th>Descripción</th>
                <th>Importe</th>
                <th>Porcentaje</th>
                <th>IVA</th>
                <th>Con Horas</th>
                <th>H. Extra</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tiposGasto.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    No se encontraron tipos de gasto
                  </td>
                </tr>
              ) : (
                tiposGasto.map((tg) => (
                  <tr key={tg.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(tg.id)}
                        onChange={() => handleSelect(tg.id)}
                      />
                    </td>
                    <td>{tg.etiqueta}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "220px" }}
                      title={tg.descripcion}
                    >
                      {tg.descripcion}
                    </td>
                    <td>{tg.importe ?? "—"}</td>
                    <td>{tg.porcentaje != null ? `${tg.porcentaje}%` : "—"}</td>
                    <td>{tg.descripcion_iva ?? "—"}</td>
                    <td>{tg.conhoras === 1 ? "Sí" : "No"}</td>
                    <td>{tg.eshoraextra === 1 ? "Sí" : "No"}</td>
                    <td>
                      {tg.fecha_baja ? (
                        <span className="text-danger">Baja</span>
                      ) : (
                        <span className="text-success">Activo</span>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() =>
                          navigate(`/home/gestion-tipos-gasto/detalle/${tg.id}`)
                        }
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <PaginationControl
            currentPage={pagination.currentPage}
            totalPaginas={pagination.totalPaginas}
            paginasVisibles={pagination.paginasVisibles}
            startPage={pagination.startPage}
            endPage={pagination.endPage}
            onPageChange={pagination.handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default GestionTipoGastos;
