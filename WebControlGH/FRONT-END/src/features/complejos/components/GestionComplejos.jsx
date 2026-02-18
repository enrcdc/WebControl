import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { complejoService } from "../services/complejo.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { PaginationControl } from "Components/ui";

function GestionComplejos() {
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

  const fetchComplejos = useCallback(
    ({ limit, offset }) =>
      complejoService.getAll({
        limit,
        offset,
        ...(searchTerm && { nombre: searchTerm }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, mostrarBaja],
  );

  const { items: complejos, loading, error, setError, pagination, refreshData } =
    useGestionEntidad(fetchComplejos, 20);

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

  const handleBajaComplejos = async () => {
    if (selected.length === 0) return alert("Selecciona al menos un complejo");
    if (!window.confirm(`¿Dar de baja ${selected.length} complejo(s)?`)) return;
    try {
      await complejoService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja los complejos");
    }
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Complejos</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button onClick={() => navigate("/home/nuevo-complejo")}>
          Nuevo Complejo
        </Button>
        <Button variant="danger" onClick={handleBajaComplejos}>
          Baja Complejo
        </Button>
      </div>

      {/* Búsqueda + Filtros */}
      <Form onSubmit={handleSearch} className="d-flex mb-3 gap-2 align-items-center flex-wrap">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre..."
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
      </Form>

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
                      selected.length === complejos.length &&
                      complejos.length > 0
                    }
                    onChange={() => handleSelectAll(complejos)}
                  />
                </th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Por Defecto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {complejos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron complejos
                  </td>
                </tr>
              ) : (
                complejos.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(c.id)}
                        onChange={() => handleSelect(c.id)}
                      />
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={c.nombre}
                    >
                      {c.nombre}
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={c.direccion}
                    >
                      {c.direccion ?? "—"}
                    </td>
                    <td>{c.telefono1 ?? "—"}</td>
                    <td>{c.porDefecto ? "Sí" : "No"}</td>
                    <td>
                      {c.fecha_baja ? (
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
                          navigate(`/home/gestion-complejos/detalle/${c.id}`)
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

export default GestionComplejos;
