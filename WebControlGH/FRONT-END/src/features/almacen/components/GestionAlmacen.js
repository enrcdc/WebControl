import { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Alert, Spinner } from "react-bootstrap";
import { almacenService } from "../services/almacen.service";
import { useServerPagination } from "hooks/useServerPagination";
import { PaginationControl } from "Components/ui";

const INITIAL_FORM = {
  cod: "",
  descripcion: "",
  stock: "",
  stockMin: "",
  stockMax: "",
  precioUnitario: "",
};

function GestionAlmacen() {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editId, setEditId] = useState(null);
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

  // Fetch productos cuando cambia página, búsqueda o después de CRUD
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit, offset };
        if (searchTerm) params.descripcion = searchTerm;
        const res = await almacenService.getAll(params);
        setProductos(res.data.data);
        setTotal(res.data.pagination?.total ?? 0);
      } catch (err) {
        if (err.response?.status === 404) {
          setProductos([]);
          setTotal(0);
        } else {
          setError("Error al obtener productos");
          setProductos([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [searchTerm, offset, limit, refreshKey]);

  const refreshData = () => setRefreshKey((k) => k + 1);

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

  // -- CRUD handlers -- \\

  const handleAgregar = () => {
    setFormData(INITIAL_FORM);
    setEditId(null);
    setShowModal(true);
  };

  const handleEditar = (producto) => {
    setFormData({
      cod: producto.codigo ?? "",
      descripcion: producto.descripcion ?? "",
      stock: producto.stock ?? "",
      stockMin: producto.stock_min ?? "",
      stockMax: producto.stock_max ?? "",
      precioUnitario: producto.precio_minimo ?? "",
    });
    setEditId(producto.id);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await almacenService.delete(id);
      refreshData();
    } catch (err) {
      setError("Error al eliminar el producto");
    }
  };

  const handleGuardar = async () => {
    if (!formData.cod || !formData.descripcion) {
      return alert("Código y descripción son obligatorios");
    }
    try {
      const payload = {
        cod: formData.cod,
        descripcion: formData.descripcion,
      };
      if (formData.stock !== "") payload.stock = Number(formData.stock);
      if (formData.stockMin !== "")
        payload.stockMin = Number(formData.stockMin);
      if (formData.stockMax !== "")
        payload.stockMax = Number(formData.stockMax);
      if (formData.precioUnitario !== "")
        payload.precioUnitario = Number(formData.precioUnitario);

      if (editId) {
        await almacenService.update(editId, payload);
      } else {
        await almacenService.create(payload);
      }
      setShowModal(false);
      refreshData();
    } catch (err) {
      setError("Error al guardar el producto");
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // -- Render -- \\

  return (
    <div className="container mt-4">
      <h2 style={{ color: "white" }}>Gestión de Almacén</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de búsqueda */}
      <Form onSubmit={handleSearch} className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por descripción..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="me-2"
        />
        <Button type="submit" variant="primary" className="me-2">
          Buscar
        </Button>
        {searchTerm && (
          <Button variant="outline-secondary" onClick={handleClearSearch}>
            Limpiar
          </Button>
        )}
        <Button className="ms-auto" onClick={handleAgregar}>
          Agregar Producto
        </Button>
      </Form>

      {/* Tabla de productos */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Código</th>
                <th style={{ width: "120px" }}>Descripción</th>
                <th style={{ width: "70px" }}>Proveedor</th>
                <th>Stock</th>
                <th>Mín</th>
                <th>Máx</th>
                <th>Precio Unit.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id}>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "120px" }}
                      title={prod.codigo}
                    >
                      {prod.codigo}
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "150px" }}
                      title={prod.descripcion}
                    >
                      {prod.descripcion}
                    </td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: "150px" }}
                      title={prod.NombreProveedor}
                    >
                      {prod.NombreProveedor ?? "—"}
                    </td>
                    <td>{prod.stock}</td>
                    <td>{prod.stock_min}</td>
                    <td>{prod.stock_max}</td>
                    <td>{prod.precio_minimo}</td>
                    <td>
                      <Button
                        size="sm"
                        style={{ display: "block" }}
                        variant="warning"
                        className="me-1"
                        onClick={() => handleEditar(prod)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        style={{ display: "block" }}
                        variant="danger"
                        onClick={() => handleEliminar(prod.id)}
                      >
                        Eliminar
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

      {/* Modal Agregar/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Editar Producto" : "Agregar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Código *</Form.Label>
              <Form.Control
                name="cod"
                value={formData.cod}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Stock Mínimo</Form.Label>
              <Form.Control
                name="stockMin"
                type="number"
                value={formData.stockMin}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Stock Máximo</Form.Label>
              <Form.Control
                name="stockMax"
                type="number"
                value={formData.stockMax}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Precio Unitario</Form.Label>
              <Form.Control
                name="precioUnitario"
                type="number"
                step="0.01"
                value={formData.precioUnitario}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar}>
            {editId ? "Guardar Cambios" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionAlmacen;
