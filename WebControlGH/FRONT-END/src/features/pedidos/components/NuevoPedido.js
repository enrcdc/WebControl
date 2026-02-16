import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { pedidoService } from "../services/pedido.service";

const formDataPorDefecto = {
  id: "",
  obra: "",
  cliente: "",
  proveedor: "",
  fecha: "",
  estado: "",
  importe: "",
  concepto: "",
  referencia: "",
  observaciones: "",
};

// Componente para la creación de pedidos
const NuevoPedido = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState(formDataPorDefecto);

  // Handler para cancelar la operacion de creacion
  const handleCancel = () => {
    navigate(-1); // Redirige a la página anterior
  };

  // Handler para la guardar el nuevo pedido
  const handleSave = async (event) => {
    // Prevenimos el comportamiento por defecto del submit
    event.preventDefault();

    try {
      await pedidoService.create(formData);
      alert("Pedido guardado con éxito");
      navigate("/home/gestion-pedidos");
    } catch (error) {
      console.log(`Error al guardar el pedido - ${error}`);
      alert("Error al guardar el pedido.");
    }
  };

  // Handler para las actualizaciones en el form del pedido
  const handleOnChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // JSX a renderizar
  return (
    <Container className="nueva-factura-container">
      <h2>Nuevo Pedido</h2>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="id">
          {/* ESTO ES TEMPORAL. EL USUARIO NO DEBE PODER INTRODUCIR EL ID */}
          <Form.Label>Id del pedido</Form.Label>
          <Form.Control
            type="text"
            value={formData.id}
            name="id"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="obra">
          <Form.Label>Obra del pedido:</Form.Label>
          <Form.Control
            type="text"
            value={formData.obra}
            name="obra"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="cliente">
          <Form.Label>Cliente:</Form.Label>
          <Form.Control
            type="text"
            value={formData.cliente}
            name="cliente"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="proveedor">
          <Form.Label>Proveedor:</Form.Label>
          <Form.Control
            type="text"
            value={formData.proveedor}
            name="proveedor"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="fecha">
          <Form.Label>Fecha:</Form.Label>
          <Form.Control
            type="date"
            value={formData.fecha}
            name="fecha"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="estado">
          <Form.Label>Estado:</Form.Label>
          <Form.Select
            name="estado"
            value={formData.estado}
            onChange={handleOnChange}
          >
            <option value="">Seleccionar</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Enviado">Enviado</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="importe">
          <Form.Label>Importe:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={formData.importe}
            name="importe"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="concepto">
          <Form.Label>Concepto:</Form.Label>
          <Form.Control
            type="text"
            value={formData.concepto}
            name="concepto"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="referencia">
          <Form.Label>Referencia:</Form.Label>
          <Form.Control
            type="text"
            value={formData.referencia}
            name="referencia"
            onChange={handleOnChange}
          />
        </Form.Group>

        <Form.Group controlId="observaciones">
          <Form.Label>Observaciones:</Form.Label>
          <Form.Control
            type="text"
            value={formData.observaciones}
            name="observaciones"
            onChange={handleOnChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Pedido
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default NuevoPedido;
