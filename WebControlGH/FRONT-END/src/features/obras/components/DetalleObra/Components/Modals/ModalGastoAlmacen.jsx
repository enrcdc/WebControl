// ESTE ARCHIVO CONTIENE LA MODAL DE GASTOS DE ALMACEN PARAMETRIZADA

import { Modal, Form, Button, Col } from "react-bootstrap";

const ModalGastoAlmacen = ({
  show,
  formData,
  editID,
  obra,
  usuarios,
  productoSeleccionado,
  sugerenciasProductos,
  busquedaProducto,
  onHide,
  onChangeForm,
  onGuardar,
  onBuscarProducto,
  onSeleccionarProducto,
  onEliminarProducto,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editID ? "Detalle gasto" : "Nuevo gasto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Referencia:</Form.Label>

            <div className="mb-2 position-relative">
              <Form.Control
                type="text"
                placeholder="Buscar producto por referencia..."
                value={busquedaProducto}
                onChange={onBuscarProducto}
                autoComplete="off"
                disabled={editID}
              />
              {/* Sugerencias productos*/}
              {sugerenciasProductos.length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{ zIndex: 10 }}
                >
                  {sugerenciasProductos.map((producto) => (
                    <li
                      key={producto.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => onSeleccionarProducto(producto)}
                      style={{ cursor: "pointer" }}
                    >
                      {producto.descripcion}
                    </li>
                  ))}
                </ul>
              )}
              {/* Producto seleccionado */}
              {productoSeleccionado && (
                <div className="mt-2">
                  <span>
                    <strong>Producto:</strong>{" "}
                    {productoSeleccionado.descripcion}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={onEliminarProducto}
                    disabled={editID}
                  >
                    Quitar
                  </Button>
                </div>
              )}
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Fecha del movimiento:</Form.Label>
            <Form.Control
              type="date"
              name="fechaAlta"
              value={formData.fechaAlta || ""}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Usuario:</Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                name="usuarioAlta"
                value={formData.usuarioAlta || ""}
                onChange={onChangeForm}
              >
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <option
                      key={usuario.codigo_usuario}
                      value={usuario.codigo_usuario}
                    >
                      {`(${usuario.codigo_firma}) ${usuario.nombre || ""} ${
                        usuario.apellido1 || ""
                      } ${usuario.apellido2 || ""}`}
                    </option>
                  ))
                ) : (
                  <option>Cargando usuarios...</option>
                )}
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tipo:</Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                name="tipoMovimiento"
                value={formData.tipoMovimiento}
                disabled={true}
              >
                <option value="1">[IN] Entrada</option>
                <option value="2">[OUT] Salida</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group>
            <Form.Label>Concepto:</Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                name="conceptoMovimiento"
                value={formData.conceptoMovimiento}
                disabled={true}
              >
                <option value="1">[ALTA] Alta en Almacen</option>
                <option value="2">[CS] Compra sin Factura</option>
                <option value="3">[AJUSTE] Ajuste por inventario</option>
                <option value="4">[DEV] Devolución</option>
                <option value="5">[OTROS] Otros conceptos</option>
                <option value="6">[CF] Compra con Factura</option>
                <option value="7">[OBRA] Asignación a obra</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group>
            <Form.Label>Obra:</Form.Label>
            <Form.Control
              value={obra.descripcion_obra}
              name="idObra"
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cantidad:</Form.Label>
            <Form.Control
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Importe unit.:</Form.Label>
            <Form.Control
              name="importe"
              type="number"
              value={formData.importe}
              onChange={onChangeForm}
              disabled={editID}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total:</Form.Label>
            <Form.Control
              type="number"
              value={(formData.cantidad * formData.importe).toFixed(2)}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              name="observaciones"
              value={formData.observaciones}
              onChange={onChangeForm}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGastoAlmacen;
