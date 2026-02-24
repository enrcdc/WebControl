import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { pedidoService } from "../services/pedido.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { PaginationControl } from "Components/ui";

function GestionPedidos() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarBaja, setMostrarBaja] = useState(false);

  const {
    selected,
    handleSelect,
    handleSelectAll,
    clearSelections,
    isSelected,
  } = useSeleccionMultiple("id_pedido");

  const fetchPedidos = useCallback(
    ({ limit, offset }) =>
      pedidoService.getAll({
        limit,
        offset,
        ...(searchTerm && { codigoPedido: searchTerm }),
        ...(fechaInicio && { fechaInicio }),
        ...(fechaFin && { fechaFin }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, fechaInicio, fechaFin, mostrarBaja],
  );

  const {
    items: pedidos,
    loading,
    error,
    setError,
    pagination,
    refreshData,
  } = useGestionEntidad(fetchPedidos, 20);

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

  // -- Filtros fecha --
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
  const handleBajaPedidos = async () => {
    if (selected.length === 0) return alert("Selecciona al menos un pedido");
    if (!window.confirm(`¿Dar de baja ${selected.length} pedido(s)?`)) return;
    try {
      await pedidoService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja los pedidos");
    }
  };

  // -- Render --
  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Pedidos</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button onClick={() => navigate("/home/nuevo-pedido")}>
          Nuevo Pedido
        </Button>
        <Button variant="danger" onClick={handleBajaPedidos}>
          Baja Pedido
        </Button>
      </div>

      {/* Búsqueda + Filtros */}
      <Form
        onSubmit={handleSearch}
        className="d-flex mb-3 gap-2 align-items-center flex-wrap"
      >
        <Form.Control
          type="text"
          placeholder="Buscar por código de pedido..."
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
                      selected.length === pedidos.length && pedidos.length > 0
                    }
                    onChange={() => handleSelectAll(pedidos)}
                  />
                </th>
                <th>Código Pedido</th>
                <th>Posición</th>
                <th>Fecha</th>
                <th>Importe</th>
                <th>Observaciones</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(pedido.id_pedido)}
                        onChange={() => handleSelect(pedido.id_pedido)}
                      />
                    </td>
                    <td>{pedido.codigo_pedido ?? "—"}</td>
                    <td>{pedido.posicion ?? "—"}</td>
                    <td>
                      {pedido.fecha
                        ? new Date(pedido.fecha).toLocaleDateString("es-ES")
                        : "—"}
                    </td>
                    <td>{pedido.importe != null ? `${pedido.importe} €` : "—"}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={pedido.observaciones}
                    >
                      {pedido.observaciones ?? "—"}
                    </td>
                    <td>
                      {pedido.fecha_baja ? (
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
                            `/home/gestion-pedidos/detalle/${pedido.id_pedido}`,
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

export default GestionPedidos;
