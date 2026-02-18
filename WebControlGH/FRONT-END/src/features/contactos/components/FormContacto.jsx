import { Form, Row, Col } from "react-bootstrap";

/**
 * Formulario de campos de contacto. Compartido entre CrearContacto y DetalleContacto.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 * @param {React.ReactNode} props.children - Contenido adicional (empresa, complejos)
 */
function FormContacto({ formData, handleChange, readOnly = false, children }) {
  return (
    <Form>
      <Row>
        <Col md={4}>
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
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              name="apellido1"
              style={{ border: "2px solid #3498db" }}
              value={formData.apellido1}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              name="apellido2"
              style={{ border: "2px solid #3498db" }}
              value={formData.apellido2}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>DNI / NIF</Form.Label>
            <Form.Control
              name="dni"
              style={{ border: "2px solid #3498db" }}
              value={formData.dni}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono 1</Form.Label>
            <Form.Control
              name="telefono"
              style={{ border: "2px solid #3498db" }}
              value={formData.telefono}
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
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Email 1</Form.Label>
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
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Email 2</Form.Label>
            <Form.Control
              name="email2"
              type="email"
              style={{ border: "2px solid #3498db" }}
              value={formData.email2}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

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

      {/* Slot para empresa, complejos, etc. */}
      {children}
    </Form>
  );
}

export default FormContacto;
