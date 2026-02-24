import { Form, Row, Col } from "react-bootstrap";

/**
 * Formulario de campos de factura (solo lectura). Usado por DetalleFactura.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 * @param {React.ReactNode} props.children - Contenido adicional (ej: selector de obra/pedido)
 */
function FormFactura({ formData, handleChange, readOnly = false, children }) {
  return (
    <Form>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Código Factura *</Form.Label>
            <Form.Control
              name="codigoFactura"
              style={{ border: "2px solid #3498db" }}
              value={formData.codigoFactura}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Posición</Form.Label>
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
        <Col md={4}>
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
      </Row>

      <Row>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Fecha</Form.Label>
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
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Cobrado</Form.Label>
            <Form.Check
              name="cobrado"
              type="checkbox"
              checked={formData.cobrado}
              onChange={handleChange}
              disabled={readOnly}
            />
          </Form.Group>
        </Col>
        {formData.cobrado && (
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Fecha Cobro</Form.Label>
              <Form.Control
                name="fechaCobro"
                type="date"
                style={{ border: "2px solid #3498db" }}
                value={formData.fechaCobro}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Concepto Factura</Form.Label>
            <Form.Control
              name="conceptoFactura"
              style={{ border: "2px solid #3498db" }}
              value={formData.conceptoFactura}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Concepto Línea</Form.Label>
            <Form.Control
              name="conceptoLinea"
              style={{ border: "2px solid #3498db" }}
              value={formData.conceptoLinea}
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

      {children}
    </Form>
  );
}

export default FormFactura;
