import { Form, Row, Col } from "react-bootstrap";

// TODO: Mover a catálogo de BBDD en el futuro si es que aumenta
const TIPOS_EMPRESA = [
  { id: 1, descripcion: "Sin Especificar" },
  { id: 3, descripcion: "Cliente" },
];

/**
 * Formulario de campos de empresa. Compartido entre CrearEmpresa y DetalleEmpresa.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 * @param {Array} props.tiposFactura - Catálogo de tipos de factura
 * @param {React.ReactNode} props.children - Contenido adicional (ej: sección de contactos)
 */
function FormEmpresa({
  formData,
  handleChange,
  readOnly = false,
  tiposFactura = [],
  children,
}) {
  return (
    <Form>
      {/* Datos básicos */}
      <Row>
        <Col md={5}>
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
        <Col md={3}>
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
        <Col md={4}>
          <Form.Group className="mb-2">
            <Form.Label>Tipo de Empresa</Form.Label>
            <Form.Select
              name="tipoEmpresa"
              style={{ border: "2px solid #3498db" }}
              value={formData.tipoEmpresa}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="">Seleccionar...</option>
              {TIPOS_EMPRESA.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

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

      {/* Contacto empresa */}
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
          style={{ border: "2px solid #3498db" }}
          type="email"
          value={formData.email}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </Form.Group>

      {/* Facturación */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Tipo de Factura</Form.Label>
            <Form.Select
              name="tipoFactura"
              style={{ border: "2px solid #3498db" }}
              value={formData.tipoFactura}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="">Seleccionar...</option>
              {tiposFactura.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.Descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Evaluación</Form.Label>
            <Form.Control
              name="evaluacion"
              style={{ border: "2px solid #3498db" }}
              type="number"
              value={formData.evaluacion}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Opciones */}
      <Row className="mb-3">
        <Col>
          <Form.Check
            type="checkbox"
            name="mostrarSaldo"
            label="Mostrar Saldo"
            checked={!!formData.mostrarSaldo}
            onChange={handleChange}
            disabled={readOnly}
          />
        </Col>
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

      {/* Observaciones */}
      <Form.Group className="mb-3">
        <Form.Label>Observaciones</Form.Label>
        <Form.Control
          as="textarea"
          style={{ border: "2px solid #3498db" }}
          rows={3}
          name="observaciones"
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

export default FormEmpresa;
