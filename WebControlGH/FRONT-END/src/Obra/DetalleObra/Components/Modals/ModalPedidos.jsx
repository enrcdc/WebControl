// ESTE ARCHIVO CONTIENE LA MODAL DE PEDIDOS PARAMETRIZADA
import { Modal, Form, Button } from "react-bootstrap";

const ModalPedido = ({
  show,
  formData,
  editID,
  onHide,
  onChangeForm,
  onGuardar,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editID ? "Detalle pedido" : "Nuevo pedido"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fechaPedido"
              value={formData.fechaPedido || ""}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Código</Form.Label>
            <Form.Control
              name="codigoPedido"
              value={formData.codigoPedido}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Posición</Form.Label>
            <Form.Control
              name="posicion"
              type="number"
              value={formData.posicion}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Importe</Form.Label>
            <Form.Control
              name="importe"
              type="number"
              value={formData.importe}
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

export default ModalPedido;
