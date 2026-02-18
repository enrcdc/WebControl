import { Form, Row, Col } from "react-bootstrap";

/**
 * Formulario de campos de complejo. Compartido entre CrearComplejo y DetalleComplejo.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 * @param {React.ReactNode} props.children - Contenido adicional (ej: sección de contactos)
 */
function FormComplejo({ formData, handleChange, readOnly = false, children }) {
  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              name="nombre"
              style={{ border: "2px solid #3498db" }}
              value={formData.nombre}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="direccion"
              style={{ border: "2px solid #3498db" }}
              value={formData.direccion}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono 1</Form.Label>
            <Form.Control
              name="telefono1"
              style={{ border: "2px solid #3498db" }}
              value={formData.telefono1}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono 2</Form.Label>
            <Form.Control
              name="telefono2"
              style={{ border: "2px solid #3498db" }}
              value={formData.telefono2}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              style={{ border: "2px solid #3498db" }}
              value={formData.email}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Check
            type="checkbox"
            name="porDefecto"
            label="Por Defecto"
            checked={!!formData.porDefecto}
            onChange={handleChange}
            disabled={readOnly}
          />
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Observaciones</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="observaciones"
          style={{ border: "2px solid #3498db" }}
          value={formData.observaciones}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </Form.Group>

      {/* Slot para contenido adicional (contactos, etc.) */}
      {children}
    </Form>
  );
}

export default FormComplejo;
