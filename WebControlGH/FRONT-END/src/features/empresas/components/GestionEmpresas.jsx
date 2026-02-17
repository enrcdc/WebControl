import { useEffect, useState } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../services/empresa.service";
import { useServerPagination } from "hooks/useServerPagination";
import { useSeleccionMultiple } from "hooks/useSeleccionMultiple";
import { PaginationControl } from "Components/ui";

// TODO: Mover a catálogo de BBDD en el futuro si es que aumenta
const TIPOS_EMPRESA = [
  { id: 1, descripcion: "Sin Especificar" },
  { id: 3, descripcion: "Cliente" },
];

function GestionEmpresas() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    selected,
    handleSelect,
    handleSelectAll,
    clearSelections,
    isSelected,
  } = useSeleccionMultiple();
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    currentPage,
    totalPaginas,
    limit,
    offset,
    startPage,
    endPage,
    paginasVisibles,
    handlePageChange,
    resetToFirstPage,
  } = useServerPagination(total, 20);

  // Fetch empresas cuando cambia página, búsqueda, filtro o después de CRUD
  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit, offset };
        if (searchTerm) params.nombre = searchTerm;
        if (tipoFiltro) params.tipoEmpresa = tipoFiltro;
        const res = await empresaService.getAll(params);
        setEmpresas(res.data.data);
        setTotal(res.data.pagination?.total ?? 0);
      } catch (err) {
        if (err.response?.status === 404) {
          setEmpresas([]);
          setTotal(0);
        } else {
          setError("Error al obtener empresas");
          setEmpresas([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmpresas();
  }, [searchTerm, tipoFiltro, offset, limit, refreshKey]);

  const refreshData = () => setRefreshKey((k) => k + 1);

  // -- Búsqueda --
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    resetToFirstPage();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    resetToFirstPage();
  };

  // -- Filtro tipo empresa --
  const handleTipoChange = (e) => {
    setTipoFiltro(e.target.value);
    resetToFirstPage();
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
    } catch (err) {
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

      {/* Búsqueda + Filtro */}
      <Form onSubmit={handleSearch} className="d-flex mb-3 gap-2">
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
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {empresas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
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
            currentPage={currentPage}
            totalPaginas={totalPaginas}
            paginasVisibles={paginasVisibles}
            startPage={startPage}
            endPage={endPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default GestionEmpresas;
