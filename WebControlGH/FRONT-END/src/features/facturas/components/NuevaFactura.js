import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { facturaService } from "../services/factura.service";

const NuevaFactura = () => {
  const navigate = useNavigate();

  const [idObra, setIdObra] = useState("");
  const [idFacturasCompras, setIdFacturasCompras] = useState("");
  const [importe, setImporte] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleCancel = () => navigate(-1);

  const handleSave = async (e) => {
    e.preventDefault();

    const datosFactura = {
      idObra: Number(idObra),
      idFacturasCompras: Number(idFacturasCompras),
      importe: parseFloat(importe) || 0,
      fechaAlta: fechaAlta || new Date().toISOString().slice(0, 10),
      codigoUsuarioAlta: 1, // usuario por defecto
      observaciones: observaciones || "Sin observaciones",
      version: 1, // versión inicial
    };

    try {
      await facturaService.create(datosFactura);
      alert("Factura guardada con éxito");
      navigate("/home/gestion-facturas");
    } catch (error) {
      console.error(
        "Error al guardar la factura:",
        error.response?.data || error.message,
      );
      alert("Error al guardar la factura. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Container className="nueva-factura-container">
      <h2>Nueva Factura</h2>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="idObra">
          <Form.Label>ID de Obra</Form.Label>
          <Form.Control
            type="number"
            value={idObra}
            onChange={(e) => setIdObra(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="idFacturasCompras">
          <Form.Label>ID Factura Compra</Form.Label>
          <Form.Control
            type="number"
            value={idFacturasCompras}
            onChange={(e) => setIdFacturasCompras(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="importe">
          <Form.Label>Importe</Form.Label>
          <Form.Control
            type="number"
            value={importe}
            onChange={(e) => setImporte(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="fechaAlta">
          <Form.Label>Fecha de Alta</Form.Label>
          <Form.Control
            type="date"
            value={fechaAlta}
            onChange={(e) => setFechaAlta(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="observaciones">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Factura
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default NuevaFactura;
