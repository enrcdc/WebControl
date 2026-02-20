import { Form, Row, Col } from "react-bootstrap";

/**
 * Formulario de campos de proveedor. Compartido entre CrearProveedor y DetalleProveedor.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 */
function FormProveedor({ formData, handleChange, readOnly = false }) {
  return (
    <Form>
      {/* Código + Nombre + CIF */}
      <Row>
        <Col md={2}>
          <Form.Group className="mb-2">
            <Form.Label>Código</Form.Label>
            <Form.Control
              name="codigo"
              style={{ border: "2px solid #3498db" }}
              value={formData.codigo}
              readOnly
            />
          </Form.Group>
        </Col>
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
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>CIF</Form.Label>
            <Form.Control
              name="cif"
              style={{ border: "2px solid #3498db" }}
              value={formData.cif}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Persona de contacto */}
      <Form.Group className="mb-2">
        <Form.Label>Persona de Contacto</Form.Label>
        <Form.Control
          name="contacto"
          style={{ border: "2px solid #3498db" }}
          value={formData.contacto}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder="Nombre completo de la persona de contacto"
        />
      </Form.Group>

      {/* Dirección */}
      <Row>
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
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Población</Form.Label>
            <Form.Control
              name="poblacion"
              style={{ border: "2px solid #3498db" }}
              value={formData.poblacion}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Provincia</Form.Label>
            <Form.Control
              name="provincia"
              style={{ border: "2px solid #3498db" }}
              value={formData.provincia}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              name="cp"
              style={{ border: "2px solid #3498db" }}
              value={formData.cp}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Contacto */}
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
            <Form.Label>Fax</Form.Label>
            <Form.Control
              name="fax"
              style={{ border: "2px solid #3498db" }}
              value={formData.fax}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

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

      {/* Evaluación */}
      <Form.Group className="mb-2">
        <Form.Label>Evaluación</Form.Label>
        <Form.Control
          name="evaluacion"
          type="number"
          style={{ border: "2px solid #3498db" }}
          value={formData.evaluacion}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </Form.Group>

      {/* Observaciones */}
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
    </Form>
  );
}

export default FormProveedor;
