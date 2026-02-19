import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../services/empresa.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { PaginationControl } from "Components/ui";
import { TIPOS_EMPRESA } from "./FormEmpresa";

function GestionEmpresas() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [mostrarBaja, setMostrarBaja] = useState(false);

  const {
    selected,
    handleSelect,
    handleSelectAll,
    clearSelections,
    isSelected,
  } = useSeleccionMultiple();

  const fetchEmpresas = useCallback(
    ({ limit, offset }) =>
      empresaService.getAll({
        limit,
        offset,
        ...(searchTerm && { nombre: searchTerm }),
        ...(tipoFiltro && { tipoEmpresa: tipoFiltro }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, tipoFiltro, mostrarBaja],
  );

  const {
    items: empresas,
    loading,
    error,
    setError,
    pagination,
    refreshData,
  } = useGestionEntidad(fetchEmpresas, 20);

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
  const handleTipoChange = (e) => {
    setTipoFiltro(e.target.value);
    pagination.resetToFirstPage();
  };

  const handleMostrarBajaChange = (e) => {
    setMostrarBaja(e.target.checked);
    pagination.resetToFirstPage();
  };

  // -- Acciones --
  const handleBajaEmpresas = async () => {
    if (selected.length === 0)
      return alert("Selecciona al menos una empresa");
    if (!window.confirm(`¿Dar de baja ${selected.length} empresa(s)?`))
      return;
    try {
      await empresaService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja las empresas");
    }
  };

  // -- Helpers --
  const getTipoEmpresaText = (tipo) => {
    const found = TIPOS_EMPRESA.find((t) => t.id === tipo);
    return found ? found.descripcion : "—";
  };

  // -- Render --
  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Empresas</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button onClick={() => navigate("/home/nueva-empresa")}>
          Nueva Empresa
        </Button>
        <Button variant="danger" onClick={handleBajaEmpresas}>
          Baja Empresa
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/home/imprimir-empresa")}
        >
          Imprimir Empresa
        </Button>
      </div>

      {/* Búsqueda + Filtros */}
      <Form
        onSubmit={handleSearch}
        className="d-flex mb-3 gap-2 align-items-center flex-wrap"
      >
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
        <Form.Select
          value={tipoFiltro}
          onChange={handleTipoChange}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Todos los tipos</option>
          {TIPOS_EMPRESA.map((t) => (
            <option key={t.id} value={t.id}>
              {t.descripcion}
            </option>
          ))}
        </Form.Select>
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
                      selected.length === empresas.length &&
                      empresas.length > 0
                    }
                    onChange={() => handleSelectAll(empresas)}
                  />
                </th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Contactos</th>
                <th>PorDefecto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {empresas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No se encontraron empresas
                  </td>
                </tr>
              ) : (
                empresas.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(emp.id)}
                        onChange={() => handleSelect(emp.id)}
                      />
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={emp.nombre}
                    >
                      {emp.nombre}
                    </td>
                    <td>{getTipoEmpresaText(emp.tipoEmpresa)}</td>
                    <td>{emp.telefono1 ?? "—"}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "180px" }}
                      title={emp.email}
                    >
                      {emp.email ?? "—"}
                    </td>
                    <td>{emp.contactosCount ?? 0}</td>
                    <td>{emp.porDefecto ? "Sí" : "No"}</td>
                    <td>
                      {emp.fecha_baja ? (
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
                            `/home/gestion-empresas/detalle/${emp.id}`,
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

export default GestionEmpresas;
