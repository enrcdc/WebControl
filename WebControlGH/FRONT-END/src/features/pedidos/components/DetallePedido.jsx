import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import { pedidoService } from "../services/pedido.service";
import { useFormulario } from "hooks/useFormulario";
import FormPedido from "./FormPedido";
import { fechaHoyFormateada, normalizarFecha } from "utils/fechasHelper";

const INITIAL_FORM = {
  idObra: "",
  codigoPedido: "",
  fecha: "",
  posicion: 10,
  importe: 0,
  observaciones: "",
};

const mapPedidoToForm = (p) => ({
  idObra: p.id_obra ?? "",
  codigoPedido: p.codigo_pedido ?? "",
  fecha: normalizarFecha(p.fecha) ?? fechaHoyFormateada(),
  posicion: p.posicion ?? 10,
  importe: p.importe ?? 0,
  observaciones: p.observaciones ?? "",
});

function DetallePedido() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM, [
    "importe",
    "posicion",
  ]);
  const [formOriginal, setFormOriginal] = useState(INITIAL_FORM);

  // Obra del pedido (inmutable, solo lectura)
  const [obraPedido, setObraPedido] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resPedido = await pedidoService.getById(id);

        const pedido = resPedido.data?.data;
        if (!pedido) throw new Error("not_found");

        const mapped = mapPedidoToForm(pedido);
        setFormData(mapped);
        setFormOriginal(mapped);
        setObraPedido({
          codigo: pedido.codigo_obra,
          descripcion: pedido.descripcion_obra,
        });
      } catch (error) {
        if (error.message === "not_found" || error.response?.status === 404) {
          setError("Pedido no encontrado");
        } else {
          setError("Error al cargar el pedido");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelar = () => {
    setFormData(formOriginal);
    setEditando(false);
  };

  const handleGuardar = async () => {
    if (!formData.codigoPedido.trim())
      return alert("El código de pedido es obligatorio");

    setSaving(true);
    setError(null);
    try {
      const payload = {
        codigoPedido: formData.codigoPedido,
        fecha: formData.fecha,
        posicion: formData.posicion,
        importe: formData.importe,
        observaciones: formData.observaciones,
      };

      await pedidoService.update(id, payload);
      setFormOriginal({ ...formData });
      setEditando(false);
    } catch (error) {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleBaja = async () => {
    if (!window.confirm("¿Dar de baja este pedido?")) return;
    try {
      await pedidoService.delete([Number(id)]);
      navigate("/home/gestion-pedidos");
    } catch {
      setError("Error al dar de baja el pedido");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error && !formData.codigoPedido) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate("/home/gestion-pedidos")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "black" }}>
        Detalle de Pedido — {formData.codigoPedido}
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormPedido
        formData={formData}
        handleChange={handleChange}
        readOnly={!editando}
      >
        {/* Obra (siempre de lectura) */}
        <div className="mb-3">
          <label className="form-label">Obra</label>
          <p
            style={{ border: "2px solid #3498db" }}
            className="form-control-plaintext"
          >
            {obraPedido.codigo} - {obraPedido.descripcion}
          </p>
        </div>
      </FormPedido>

      {/* Botones de acción */}
      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-pedidos")}
        >
          Volver
        </Button>
        <Button
          variant="primary"
          onClick={editando ? handleGuardar : () => setEditando(true)}
          disabled={saving}
        >
          {saving ? (
            <Spinner size="sm" />
          ) : editando ? (
            "Guardar cambios"
          ) : (
            "Editar"
          )}
        </Button>
        <Button
          variant="danger"
          onClick={editando ? handleCancelar : handleBaja}
        >
          {editando ? "Cancelar" : "Baja Pedido"}
        </Button>
      </div>
    </Card>
  );
}

export default DetallePedido;
