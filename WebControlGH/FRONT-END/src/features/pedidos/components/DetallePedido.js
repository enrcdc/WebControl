import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Form, Card, Modal } from "react-bootstrap";
import { pedidoService } from "../services/pedido.service";

const formPorDefecto = {
  estado: "",
  importe: "",
  observaciones: "",
};

function DetallePedido() {
  const { id } = useParams(); // id del pedido
  const [filteredPedido, setFilteredPedido] = useState([]);
  // Estado para mostrar la modal de edición
  const [showModal, setShowModal] = useState(false);
  // Estado para las actualizaciones en el form de edición
  const [editForm, setEditForm] = useState(formPorDefecto);
  const navigate = useNavigate();

  const fetchPedido = async (pedidoId) => {
    try {
      const res = await pedidoService.getById(pedidoId);
      const data = res.data?.data || res.data;
      setFilteredPedido(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error(`Error al obtener el pedido - ${err}`);
    }
  };

  useEffect(() => {
    fetchPedido(id);
  }, []);

  // Handler para mostrar la modal de edición con los datos del pedido
  const handleEditar = () => {
    setEditForm({
      estado: filteredPedido.estado,
      importe: filteredPedido.importe,
      observaciones: filteredPedido.observaciones,
    });
    setShowModal(true);
  };

  // Handler para guardar la edición
  const handleSave = async () => {
    try {
      await pedidoService.update(id, editForm);
      setShowModal(false);
      alert("Pedido actualizado correctamente");
      // Volvemos a mostrar el pedido con la info actualizada
      fetchPedido(id);
    } catch (err) {
      console.error(`Error al actualizar la factura - ${err}`);
    }
  };

  // Handler para manejar actualizaciones en el form de edición
  const handleInputChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: [e.target.value],
    }));
  };

  // Handler para eliminar el pedido
  const handleEliminarPedido = async () => {
    if (window.confirm("¿Estás seguro de querer eliminar este pedido?")) {
      try {
        await pedidoService.delete([id]);
        alert("Pedido eliminado correctamente");
        navigate(-1);
      } catch (err) {
        alert("Error al eliminar pedido");
        console.error(`Error al eliminar el pedido - ${err}`);
      }
    }
  };

  if (!filteredPedido) {
    return <div>Pedido no encontrado</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Detalle de Pedido</h2>

      <Card className="p-3 mb-3">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Referencia:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredPedido.referencia}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Obra:</strong>
            </Form.Label>
            <Form.Control type="text" value={filteredPedido.obra} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Cliente:</strong>
            </Form.Label>
            <Form.Control type="text" value={filteredPedido.cliente} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Proveedor:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredPedido.proveedor}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Fecha:</strong>
            </Form.Label>
            <Form.Control type="text" value={filteredPedido.fecha} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Estado:</strong>
            </Form.Label>
            <Form.Control type="text" value={filteredPedido.estado} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Importe:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={`${filteredPedido.importe} €`}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Concepto:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={filteredPedido.concepto}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Observaciones:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={filteredPedido.observaciones || "Sin observaciones"}
              readOnly
            />
          </Form.Group>
        </Form>

        {/* Botones de acción */}
        <div className="d-flex mt-3">
          <Button onClick={handleEditar} variant="primary" className="me-2">
            Editar Pedido
          </Button>
          <Button onClick={handleEliminarPedido} variant="danger">
            Eliminar Pedido
          </Button>
        </div>
      </Card>

      <Button className="mt-4" onClick={() => navigate(-1)}>
        Volver
      </Button>

      {/* Modal para editar un pedido */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{"Editar Pedido"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={editForm.estado}
                onChange={handleInputChange}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Entregado">Entregado</option>
                <option value="Enviado">Enviado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Importe</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={editForm.importe}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                name="observaciones"
                value={editForm.observaciones}
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
            {"Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DetallePedido;
