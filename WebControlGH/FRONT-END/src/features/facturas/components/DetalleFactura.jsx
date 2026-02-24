import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import { facturaService } from "../services/factura.service";
import { useFormulario } from "hooks/useFormulario";
import FormFactura from "./FormFactura";
import { fechaHoyFormateada, normalizarFecha } from "utils/fechasHelper";

const INITIAL_FORM = {
  codigoFactura: "",
  fecha: "",
  posicion: 0,
  importe: 0,
  conceptoLinea: "",
  conceptoFactura: "",
  observaciones: "",
  cobrado: false,
  fechaCobro: "",
};

const mapFacturaToForm = (f) => ({
  codigoFactura: f.codigo_factura ?? "",
  fecha: normalizarFecha(f.fecha) ?? fechaHoyFormateada(),
  posicion: f.posicion ?? 0,
  importe: f.importe ?? 0,
  conceptoLinea: f.concepto_linea ?? "",
  conceptoFactura: f.concepto_factura ?? "",
  observaciones: f.observaciones ?? "",
  cobrado: !!f.fecha_cobro,
  fechaCobro: f.fecha_cobro ? normalizarFecha(f.fecha_cobro) : "",
});

function DetalleFactura() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { formData, setFormData } = useFormulario(INITIAL_FORM);

  // Obra y Pedido del registro (solo lectura)
  const [obraFactura, setObraFactura] = useState(null);
  const [pedidoFactura, setPedidoFactura] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await facturaService.getById(id);

        const factura = res.data?.data;
        if (!factura) throw new Error("not_found");

        setFormData(mapFacturaToForm(factura));
        setObraFactura({
          codigo: factura.codigo_obra,
          descripcion: factura.descripcion_obra,
        });
        setPedidoFactura({
          codigo: factura.codigo_pedido,
        });
      } catch (error) {
        if (error.message === "not_found" || error.response?.status === 404) {
          setError("Factura no encontrada");
        } else {
          setError("Error al cargar la factura");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBaja = async () => {
    if (!window.confirm("¿Dar de baja esta factura?")) return;
    try {
      await facturaService.delete([Number(id)]);
      navigate("/home/gestion-facturas");
    } catch {
      setError("Error al dar de baja la factura");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error && !formData.codigoFactura) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate("/home/gestion-facturas")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "black" }}>
        Detalle de Factura — {formData.codigoFactura}
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormFactura formData={formData} readOnly>
        {/* Obra (solo lectura) */}
        <div className="mb-3">
          <label className="form-label">Obra</label>
          <p
            style={{ border: "2px solid #3498db" }}
            className="form-control-plaintext"
          >
            {obraFactura?.codigo
              ? `${obraFactura.codigo} - ${obraFactura.descripcion}`
              : "—"}
          </p>
        </div>
        {/* Pedido (solo lectura) */}
        <div className="mb-3">
          <label className="form-label">Pedido</label>
          <p
            style={{ border: "2px solid #3498db" }}
            className="form-control-plaintext"
          >
            {pedidoFactura?.codigo ?? "—"}
          </p>
        </div>
      </FormFactura>

      {/* Botones de acción */}
      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-facturas")}
        >
          Volver
        </Button>
        <Button variant="danger" onClick={handleBaja}>
          Baja Factura
        </Button>
      </div>
    </Card>
  );
}

export default DetalleFactura;
