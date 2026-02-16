import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Form, Card, Modal } from "react-bootstrap";
import { facturaService } from "../services/factura.service";

const formPorDefecto = {
  importe: "",
  obs_imp: "",
};

function DetalleFactura() {
  const [filteredFactura, setFilteredFactura] = useState(null);
  const { cod } = useParams(); // cod = id
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState(formPorDefecto);
  const navigate = useNavigate();

  const fetchFactura = async (id) => {
    try {
      const res = await facturaService.getById(id);
      setFilteredFactura(res.data?.data || res.data);
    } catch (err) {
      console.error("Error al obtener la factura", err);
    }
  };

  useEffect(() => {
    fetchFactura(cod);
  }, [cod]);

  // Inicializa formulario de edición
  const handleEditar = () => {
    setEditForm({
      importe: filteredFactura.importe,
      obs_imp: filteredFactura.obs_imp ?? "",
    });
    setShowModal(true);
  };

  const handleBajaFactura = async () => {
    if (!window.confirm("¿Estás seguro de querer eliminar esta factura?"))
      return;

    try {
      await facturaService.delete([cod]);
      alert("Factura eliminada correctamente");
      navigate(-1);
    } catch (error) {
      console.error("Error al eliminar la factura", error);
      alert("Error al eliminar factura");
    }
  };

  // Actualiza el estado del formulario
  const handleInputChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await facturaService.update(cod, editForm);
      setShowModal(false);
      fetchFactura(cod);
      alert("Factura actualizada correctamente");
    } catch (err) {
      console.error("Error al guardar la factura", err);
      alert("Error al guardar la factura");
    }
  };

  if (!filteredFactura) {
    return <div>Factura no encontrada</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Detalle de Factura</h2>

      <Card className="p-3 mb-3">
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Importe:</strong>
            </Form.Label>
            <Form.Control
              type="number"
              value={filteredFactura.importe}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Observaciones:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.obs_imp ?? ""}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Fecha Alta:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.fecha_alta}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Fecha Actualización:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.fecha_actualizacion ?? "-"}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Fecha Baja:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.fecha_baja ?? "-"}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Código Usuario Alta:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.codigo_usuario_alta}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Código Usuario Baja:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.codigo_usuario_baja ?? "-"}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              <strong>Versión:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.version}
              readOnly
            />
          </Form.Group>
        </Form>

        <div className="d-flex mt-3">
          <Button variant="primary" className="me-2" onClick={handleEditar}>
            Editar Factura
          </Button>
          <Button variant="danger" onClick={handleBajaFactura}>
            Baja Factura
          </Button>
        </div>
      </Card>

      <Button className="mt-3" onClick={() => navigate(-1)}>
        Volver
      </Button>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Importe</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={editForm.importe}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="obs_imp"
                value={editForm.obs_imp}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DetalleFactura;
