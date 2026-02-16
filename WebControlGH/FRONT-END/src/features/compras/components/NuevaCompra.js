import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { compraService } from "../services/compra.service";

const NuevaCompra = () => {
  const navigate = useNavigate();

  // Estado para cada campo del formulario
  const [numero, setNumero] = useState("");
  const [fechaFactura, setFechaFactura] = useState("");
  const [concepto, setConcepto] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [tipo, setTipo] = useState(0);
  const [baseIva, setBaseIva] = useState("");
  const [totalIva, setTotalIva] = useState("");
  const [asignado, setAsignado] = useState(false);
  const [totalAsignado, setTotalAsignado] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleCancel = () => {
    navigate(-1); // Redirige a la página anterior
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const datosFactura = {
      numero: numero,
      fechaFactura: fechaFactura,
      concepto: concepto,
      proveedor: proveedor,
      tipo: tipo,
      baseIva: baseIva,
      totalIva: totalIva,
      asignado: asignado,
      totalAsignado: totalAsignado,
      observaciones: observaciones,
    };

    try {
      await compraService.create(datosFactura);
      alert("Factura guardada con éxito");
      navigate("/home/gestion-compras");
    } catch (error) {
      console.error("Error al guardar la factura:", error);
      alert("Error al guardar la factura. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Container className="nueva-factura-container">
      <h2>Nueva Compra</h2>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="facturaNum">
          <Form.Label>Número factura</Form.Label>
          <Form.Control
            type="text"
            placeholder="Número de la factura"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="fechaFactura">
          <Form.Label>Fecha factura:</Form.Label>
          <Form.Control
            type="date"
            value={fechaFactura}
            onChange={(e) => setFechaFactura(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="concepto">
          <Form.Label>Concepto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Concepto de la Factura"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="proveedor">
          <Form.Label>Proveedor:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="tipo">
          <Form.Label>Tipo:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="base-iva">
          <Form.Label>Base IVA:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={baseIva}
            onChange={(e) => setBaseIva(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="total-iva">
          <Form.Label>Total IVA:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={totalIva}
            onChange={(e) => setTotalIva(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="total-asignado">
          <Form.Label>Total Asignado:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={totalAsignado}
            onChange={(e) => setTotalAsignado(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="asignado">
          <Form.Label>Asignado:</Form.Label>
          <Form.Check
            type="checkbox"
            checked={asignado}
            onChange={(e) => setAsignado(e.target.checked ? 1 : 0)}
          />
        </Form.Group>

        <Form.Group controlId="observaciones">
          <Form.Label>Observaciones:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
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

export default NuevaCompra;
