// ESTE ARCHIVO CONTIENE LA MODAL DE COMPRAS PARAMETRIZADA

import { Modal, Form, Button, Col } from "react-bootstrap";

const ModalCompra = ({
  show,
  formData,
  editID,
  usuarios,
  facturaSeleccionada,
  sugerenciasFacturas,
  busquedaFactura,
  onHide,
  onChangeForm,
  onGuardar,
  onBuscarFactura,
  onSeleccionarFactura,
  onEliminarFactura,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editID ? "Detalle compra" : "Nueva compra"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
                name="codigoUsuarioAlta"
                value={formData.codigoUsuarioAlta || ""}
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
          <Form.Group className="mb-2">
            <Form.Label>Factura:</Form.Label>

            <div className="mb-2 position-relative">
              <Form.Control
                type="text"
                placeholder="Buscar factura por concepto..."
                value={busquedaFactura}
                onChange={onBuscarFactura}
                autoComplete="off"
                disabled={editID}
              />
              {/* Sugerencias productos*/}
              {sugerenciasFacturas.length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{ zIndex: 10 }}
                >
                  {sugerenciasFacturas.map((factura) => (
                    <li
                      key={factura.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => onSeleccionarFactura(factura)}
                      style={{ cursor: "pointer" }}
                    >
                      {factura.Concepto}
                    </li>
                  ))}
                </ul>
              )}
              {/* Producto seleccionado */}
              {facturaSeleccionada && (
                <div className="mt-2">
                  <span>
                    <strong>Factura:</strong> {facturaSeleccionada.Concepto}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={onEliminarFactura}
                    disabled={editID}
                  >
                    Quitar
                  </Button>
                </div>
              )}
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Importe:</Form.Label>
            <Form.Control
              name="importe"
              type="number"
              value={formData.importe}
              onChange={onChangeForm}
              disabled={editID}
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

export default ModalCompra;
