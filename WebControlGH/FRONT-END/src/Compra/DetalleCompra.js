import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, Card, Row, Col } from 'react-bootstrap';


function DetalleCompra() {
  const { numero } = useParams(); // el número de la factura
  const navigate = useNavigate();

  // TODO: Al borrar los datos simulados, he tenido que poner [].find. (CORREGIR)
  const factura = [].find(f => f.numero === numero);

  if (!factura) {
    return <div>Factura no encontrada</div>;
  }

  const porcentajeAsignado = factura.total > 0
    ? ((factura.totalAsignado / factura.total) * 100).toFixed(2)
    : '0';

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Detalle Compra</h2>

      <Card className="p-3 mb-3">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Número:</strong></Form.Label>
                <Form.Control type="text" value={factura.numero} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Concepto:</strong></Form.Label>
                <Form.Control type="text" value={factura.concepto} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Fecha Factura:</strong></Form.Label>
                <Form.Control type="text" value={factura.fechaFactura} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Proveedor:</strong></Form.Label>
                <Form.Control type="text" value={factura.proveedor} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Tipo de Factura:</strong></Form.Label>
                <Form.Control type="text" value={factura.tipo} readOnly />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Cuadro: Importes de Factura */}
      <Card className="p-3 mb-3 bg-light">
        <h5>Importes de Factura</h5>
        <Row className="mb-2">
          <Col md={4}><strong>Base IVA:</strong> {factura.baseIva} €</Col>
          <Col md={4}><strong>Total IVA:</strong> {factura.totalIva} €</Col>
          <Col md={4}><strong>Total:</strong> {factura.total} €</Col>
        </Row>
        <Row>
          <Col md={4}><strong>IVA Aplicado:</strong> {((factura.totalIva / factura.baseIva) * 100).toFixed(2)}%</Col>
        </Row>
      </Card>

      {/* Cuadro: Asignación de Factura */}
      <Card className="p-3 mb-3 bg-light">
        <h5>Asignación de Factura</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Total Asignado:</strong> {factura.totalAsignado} €</Col>
          <Col md={6}><strong>Porcentaje Asignado:</strong> {porcentajeAsignado} %</Col>
        </Row>
      </Card>

      {/* Observaciones */}
      <Card className="p-3 mb-3">
        <Form.Group>
          <Form.Label><strong>Observaciones:</strong></Form.Label>
          <Form.Control as="textarea" rows={3} value={factura.observaciones || 'Sin observaciones'} readOnly />
        </Form.Group>
      </Card>

      {/* Botones de acción */}
              <div className="d-flex mt-3">
                <Button variant="primary" className="me-2">Editar Pedido</Button>
                <Button variant="danger">Eliminar Pedido</Button>
              </div>

      <Button className="mt-3" onClick={() => navigate(-1)}>Volver</Button>
    </Container>
  );
}

export default DetalleCompra;