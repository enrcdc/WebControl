import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { facturaService } from "../services/factura.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { PaginationControl } from "Components/ui";

function GestionFacturas() {
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
  } = useSeleccionMultiple("id_factura");

  const fetchFacturas = useCallback(
    ({ limit, offset }) =>
      facturaService.getAll({
        limit,
        offset,
        ...(searchTerm && { codigoFactura: searchTerm }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, mostrarBaja],
  );

  const {
    items: facturas,
    loading,
    error,
    setError,
    pagination,
    refreshData,
  } = useGestionEntidad(fetchFacturas, 20);

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

  const handleMostrarBajaChange = (e) => {
    setMostrarBaja(e.target.checked);
    pagination.resetToFirstPage();
  };

  // -- Acciones --
  const handleBajaFacturas = async () => {
    if (selected.length === 0) return alert("Selecciona al menos una factura");
    if (!window.confirm(`¿Dar de baja ${selected.length} factura(s)?`)) return;
    try {
      await facturaService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja las facturas");
    }
  };

  // -- Render --
  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Facturas</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button variant="danger" onClick={handleBajaFacturas}>
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
          placeholder="Buscar por código de factura..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ maxWidth: "260px" }}
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
                      selected.length === facturas.length && facturas.length > 0
                    }
                    onChange={() => handleSelectAll(facturas)}
                  />
                </th>
                <th>Código Factura</th>
                <th>Pedido</th>
                <th>Posición</th>
                <th>Fecha</th>
                <th>Importe</th>
                <th>Concepto Factura</th>
                <th>Observaciones</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                facturas.map((factura) => (
                  <tr key={factura.id_factura}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(factura.id_factura)}
                        onChange={() => handleSelect(factura.id_factura)}
                      />
                    </td>
                    <td>{factura.codigo_factura ?? "—"}</td>
                    <td>{factura.codigo_pedido ?? "—"}</td>
                    <td>{factura.posicion ?? "—"}</td>
                    <td>
                      {factura.fecha
                        ? new Date(factura.fecha).toLocaleDateString("es-ES")
                        : "—"}
                    </td>
                    <td>
                      {factura.importe != null
                        ? `${factura.importe} €`
                        : "—"}
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={factura.concepto_factura}
                    >
                      {factura.concepto_factura ?? "—"}
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={factura.observaciones}
                    >
                      {factura.observaciones ?? "—"}
                    </td>
                    <td>
                      {factura.fecha_baja ? (
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
                            `/home/gestion-facturas/detalle/${factura.id_factura}`,
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

export default GestionFacturas;
