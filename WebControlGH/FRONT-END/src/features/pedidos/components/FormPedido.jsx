import { Form, Row, Col } from "react-bootstrap";

/**
 * Formulario de campos de pedido. Compartido entre CrearPedido y DetallePedido.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 * @param {React.ReactNode} props.children - Contenido adicional (ej: sección de contactos)
 */
function FormPedido({ formData, handleChange, readOnly = false, children }) {
  return (
    <Form>
      <Row>
        <Col md={5}>
          <Form.Group className="mb-2">
            <Form.Label>Código *</Form.Label>
            <Form.Control
              name="codigoPedido"
              style={{ border: "2px solid #3498db" }}
              value={formData.codigoPedido}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group className="mb-2">
            <Form.Label>Posicion</Form.Label>
            <Form.Control
              name="posicion"
              type="number"
              step={10}
              style={{ border: "2px solid #3498db" }}
              value={formData.posicion}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group className="mb-2">
            <Form.Label>Importe</Form.Label>
            <Form.Control
              name="importe"
              type="number"
              style={{ border: "2px solid #3498db" }}
              value={formData.importe}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Fecha del pedido</Form.Label>
            <Form.Control
              name="fecha"
              type="date"
              style={{ border: "2px solid #3498db" }}
              value={formData.fecha}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2">
        <Form.Label>Observaciones</Form.Label>
        <Form.Control
          name="observaciones"
          as="textarea"
          style={{ border: "2px solid #3498db" }}
          value={formData.observaciones}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </Form.Group>
      {/* Slot para el desplegable de obra */}
      {children}
    </Form>
  );
}

export default FormPedido;
