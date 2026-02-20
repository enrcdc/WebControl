import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { compraService } from "../services/compra.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { PaginationControl } from "Components/ui";

function GestionCompras() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conceptoFiltro, setConceptoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarBaja, setMostrarBaja] = useState(false);

  const {
    selected,
    handleSelect,
    handleSelectAll,
    clearSelections,
    isSelected,
  } = useSeleccionMultiple("id");

  const fetchCompras = useCallback(
    ({ limit, offset }) =>
      compraService.getAll({
        limit,
        offset,
        ...(searchTerm && { codigoObra: searchTerm }),
        ...(conceptoFiltro && { concepto: conceptoFiltro }),
        ...(fechaInicio && { fechaInicio }),
        ...(fechaFin && { fechaFin }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, conceptoFiltro, fechaInicio, fechaFin, mostrarBaja],
  );

  const {
    items: compras,
    loading,
    error,
    setError,
    pagination,
    refreshData,
  } = useGestionEntidad(fetchCompras, 20);

  // -- Búsqueda (obra) --
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
  const handleConceptoChange = (e) => {
    setConceptoFiltro(e.target.value);
    pagination.resetToFirstPage();
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
    pagination.resetToFirstPage();
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
    pagination.resetToFirstPage();
  };

  const handleMostrarBajaChange = (e) => {
    setMostrarBaja(e.target.checked);
    pagination.resetToFirstPage();
  };

  // -- Acciones --
  const handleBajaCompras = async () => {
    if (selected.length === 0) return alert("Selecciona al menos una factura");
    if (!window.confirm(`¿Dar de baja ${selected.length} factura(s)?`)) return;
    try {
      await compraService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja las facturas");
    }
  };

  // -- Render --
  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Compras</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button onClick={() => navigate("/home/nueva-compra")}>
          Nueva Factura
        </Button>
        <Button variant="danger" onClick={handleBajaCompras}>
          Baja Factura
        </Button>
      </div>

      {/* Búsqueda + Filtros */}
      <Form
        onSubmit={handleSearch}
        className="d-flex mb-3 gap-2 align-items-center flex-wrap"
      >
        <Form.Control
          type="text"
          placeholder="Buscar por código de obra..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ maxWidth: "240px" }}
        />
        <Button type="submit" variant="primary">
          Buscar
        </Button>
        {searchTerm && (
          <Button variant="outline-secondary" onClick={handleClearSearch}>
            Limpiar
          </Button>
        )}
        <Form.Control
          type="text"
          placeholder="Filtrar por concepto..."
          value={conceptoFiltro}
          onChange={handleConceptoChange}
          style={{ maxWidth: "200px" }}
        />
        <Form.Control
          type="date"
          value={fechaInicio}
          onChange={handleFechaInicioChange}
          title="Fecha inicio"
          style={{ maxWidth: "170px" }}
        />
        <span style={{ color: "white" }}>—</span>
        <Form.Control
          type="date"
          value={fechaFin}
          onChange={handleFechaFinChange}
          title="Fecha fin"
          style={{ maxWidth: "170px" }}
        />
        <Form.Check
          type="checkbox"
          label="Mostrar dadas de Baja"
          checked={mostrarBaja}
          onChange={handleMostrarBajaChange}
          className="ms-2"
        />
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
                      selected.length === compras.length && compras.length > 0
                    }
                    onChange={() => handleSelectAll(compras)}
                  />
                </th>
                <th>Obra</th>
                <th>Nº Factura</th>
                <th>Concepto</th>
                <th>Importe</th>
                <th>Fecha Alta</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {compras.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                compras.map((compra) => (
                  <tr key={compra.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(compra.id)}
                        onChange={() => handleSelect(compra.id)}
                      />
                    </td>
                    <td>{compra.codigo_obra ?? "—"}</td>
                    <td>{compra.num_factura ?? "—"}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={compra.concepto}
                    >
                      {compra.concepto ?? "—"}
                    </td>
                    <td>{compra.importe != null ? `${compra.importe} €` : "—"}</td>
                    <td>
                      {compra.fecha_alta
                        ? new Date(compra.fecha_alta).toLocaleDateString("es-ES")
                        : "—"}
                    </td>
                    <td>
                      {compra.fecha_baja ? (
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
                          navigate(
                            `/home/gestion-compras/detalle/${compra.id}`,
                          )
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

export default GestionCompras;
