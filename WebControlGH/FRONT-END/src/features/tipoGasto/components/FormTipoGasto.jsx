import { Form, Row, Col } from "react-bootstrap";

/**
 * Formulario de campos de tipo de gasto. Compartido entre CrearTipoGasto y DetalleTipoGasto.
 *
 * @param {Object} props
 * @param {Object} props.formData - Estado del formulario (useFormulario)
 * @param {Function} props.handleChange - Handler de cambio (useFormulario)
 * @param {boolean} props.readOnly - Si true, todos los campos son read-only
 * @param {Array} props.tiposIva - Catálogo de tipos de IVA
 */
function FormTipoGasto({ formData, handleChange, readOnly = false, tiposIva = [] }) {
  return (
    <Form>
      {/* Etiqueta + Descripción */}
      <Row>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Etiqueta *</Form.Label>
            <Form.Control
              name="etiqueta"
              style={{ border: "2px solid #3498db" }}
              value={formData.etiqueta}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={9}>
          <Form.Group className="mb-2">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              name="descripcion"
              style={{ border: "2px solid #3498db" }}
              value={formData.descripcion}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Importe + Porcentaje + Tipo IVA */}
      <Row>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Importe *</Form.Label>
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
            <Form.Label>Porcentaje</Form.Label>
            <Form.Control
              name="porcentaje"
              type="number"
              style={{ border: "2px solid #3498db" }}
              value={formData.porcentaje}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Tipo de IVA</Form.Label>
            <Form.Select
              name="tipoIva"
              style={{ border: "2px solid #3498db" }}
              value={formData.tipoIva}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="">Sin IVA</option>
              {tiposIva.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.descripcion} {t.porcentaje != null ? `(${t.porcentaje}%)` : ""}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Con Horas + Es Hora Extra */}
      <Row>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Con Horas</Form.Label>
            <Form.Select
              name="conHoras"
              style={{ border: "2px solid #3498db" }}
              value={formData.conHoras}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="">—</option>
              <option value="0">No</option>
              <option value="1">Sí</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Es Hora Extra</Form.Label>
            <Form.Select
              name="esHoraExtra"
              style={{ border: "2px solid #3498db" }}
              value={formData.esHoraExtra}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="">—</option>
              <option value="0">No</option>
              <option value="1">Sí</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

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

export default FormTipoGasto;
