// ESTE ARCHIVO CONTIENE LA MODAL DE FACTURAS PARAMETRIZADA

import { Modal, Form, Button } from "react-bootstrap";

const ModalFactura = ({
  show,
  formData,
  editID,
  pedidos,
  onHide,
  onChangeForm,
  onGuardar,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editID ? "Detalle factura" : "Nueva factura"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Pedido:</Form.Label>
            <Form.Control
              name="idPedido"
              as="select"
              value={formData.idPedido}
              onChange={onChangeForm}
            >
              {pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                  <option key={pedido.id_pedido} value={pedido.id_pedido}>
                    {`${pedido.codigo_pedido} - ${pedido.posicion}`}
                  </option>
                ))
              ) : (
                <option>Cargando pedidos...</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Fecha:</Form.Label>
            <Form.Control
              type="date"
              name="fechaFactura"
              value={formData.fechaFactura || ""}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Código:</Form.Label>
            <Form.Control
              name="codigo"
              value={formData.codigo}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Posicion:</Form.Label>
            <Form.Control
              name="posicion"
              type="number"
              value={formData.posicion}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Importe:</Form.Label>
            <Form.Control
              name="importe"
              type="number"
              value={formData.importe}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Concepto F.:</Form.Label>
            <Form.Control
              name="conceptoFactura"
              value={formData.conceptoFactura}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Concepto L.:</Form.Label>
            <Form.Control
              name="conceptoLinea"
              value={formData.conceptoLinea}
              onChange={onChangeForm}
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
          <div className="d-flex align-items-center mt-3">
            <Form.Check
              name="cobrado"
              type="checkbox"
              label="Cobrado:"
              checked={formData.cobrado}
              onChange={onChangeForm}
              className="me-3"
            />

            {formData.cobrado && (
              <Form.Control
                type="date"
                name="fechaCobro"
                value={formData.fechaCobro || ""}
                onChange={onChangeForm}
              />
            )}
          </div>
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

export default ModalFactura;
