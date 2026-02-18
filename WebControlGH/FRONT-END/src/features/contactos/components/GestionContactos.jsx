import { useState, useCallback } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { contactoService } from "../services/contacto.service";
import { empresaService } from "features/empresas/services/empresa.service";
import { useGestionEntidad } from "hooks/useGestionEntidad";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple";
import { SearchableMultiSelect, PaginationControl } from "Components/ui";

function GestionContactos() {
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

  // Filtro multi-empresa
  const empresasFiltro = useBusquedaMultiple(
    (nombre) =>
      empresaService.getAll({ nombre, limit: 10 }),
    { minLength: 2 },
  );

  const fetchContactos = useCallback(
    ({ limit, offset }) =>
      contactoService.getAll({
        limit,
        offset,
        ...(searchTerm && { nombre: searchTerm }),
        ...(empresasFiltro.seleccionados.length > 0 && {
          idsEmpresa: empresasFiltro.seleccionados.map((e) => e.id),
        }),
        ...(mostrarBaja && { mostrarBaja: 1 }),
      }),
    [searchTerm, empresasFiltro.seleccionados, mostrarBaja],
  );

  const { items: contactos, loading, error, setError, pagination, refreshData } =
    useGestionEntidad(fetchContactos, 20);

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

  const handleEmpresaSelect = (empresa) => {
    empresasFiltro.seleccionar(empresa);
    pagination.resetToFirstPage();
  };

  const handleEmpresaRemove = (empresa) => {
    empresasFiltro.remover(empresa);
    pagination.resetToFirstPage();
  };

  const handleBajaContactos = async () => {
    if (selected.length === 0) return alert("Selecciona al menos un contacto");
    if (!window.confirm(`¿Dar de baja ${selected.length} contacto(s)?`)) return;
    try {
      await contactoService.delete(selected);
      clearSelections();
      refreshData();
    } catch {
      setError("Error al dar de baja los contactos");
    }
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Gestión de Contactos</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de acciones */}
      <div className="d-flex mb-3 gap-2">
        <Button onClick={() => navigate("/home/nuevo-contacto")}>
          Nuevo Contacto
        </Button>
        <Button variant="danger" onClick={handleBajaContactos}>
          Baja Contacto
        </Button>
      </div>

      {/* Búsqueda + Filtros */}
      <Form onSubmit={handleSearch} className="mb-3">
        <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
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
        </div>

        {/* Filtro multi-empresa */}
        <div style={{ maxWidth: "500px" }}>
          <Form.Label className="mb-1 text-white">Filtrar por empresa</Form.Label>
          <SearchableMultiSelect
            placeholder="Buscar empresa..."
            value={empresasFiltro.busqueda}
            onChange={empresasFiltro.handleBuscar}
            suggestions={empresasFiltro.sugerencias}
            onSelect={handleEmpresaSelect}
            renderSuggestion={(e) => e.nombre}
            keyField="id"
            selectedItems={empresasFiltro.seleccionados}
            renderSelected={(e) => e.nombre}
            onRemove={handleEmpresaRemove}
          />
        </div>
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
                      selected.length === contactos.length &&
                      contactos.length > 0
                    }
                    onChange={() => handleSelectAll(contactos)}
                  />
                </th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Empresa</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {contactos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron contactos
                  </td>
                </tr>
              ) : (
                contactos.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={isSelected(c.id)}
                        onChange={() => handleSelect(c.id)}
                      />
                    </td>
                    <td>{c.nombre}</td>
                    <td>
                      {[c.apellido1, c.apellido2].filter(Boolean).join(" ") ||
                        "—"}
                    </td>
                    <td>{c.nombre_empresa ?? "—"}</td>
                    <td>{c.telefono ?? "—"}</td>
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
                          navigate(
                            `/home/gestion-contactos/detalle/${c.id}`,
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

export default GestionContactos;
