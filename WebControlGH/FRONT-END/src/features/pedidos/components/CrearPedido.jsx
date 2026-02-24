import { useState } from "react";
import { Button, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { pedidoService } from "../services/pedido.service";
import { obraService } from "../../obras/services/obra.service";
import { useFormulario } from "hooks/useFormulario";
import { useBusquedaEntidad } from "hooks/useBusquedaEntidad";
import { SearchableSelect } from "Components/ui";
import FormPedido from "./FormPedido";
import { fechaHoyFormateada } from "utils/fechasHelper";

const INITIAL_FORM = {
  codigoPedido: "",
  fecha: fechaHoyFormateada(),
  posicion: 10,
  importe: 0,
  observaciones: "",
};

function CrearPedido() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { formData, handleChange } = useFormulario(INITIAL_FORM);

  const obra = useBusquedaEntidad(
    (termino) => obraService.getAll({ descripcion: termino, limit: 10 }),
    { minLength: 2, keyField: "id_obra" },
  );

  const handleGuardar = async () => {
    if (!formData.codigoPedido.trim())
      return alert("El código de pedido es obligatorio");
    if (!obra.entidadSeleccionada)
      return alert("Debes seleccionar una obra");

    setLoading(true);
    setError(null);

    try {
      const payload = {
        codigoPedido: formData.codigoPedido,
        fecha: formData.fecha,
        posicion: formData.posicion,
        importe: formData.importe,
        observaciones: formData.observaciones,
        idObra: obra.entidadSeleccionada.id_obra,
      };

      const res = await pedidoService.create(payload);
      const nuevoPedido = res.data?.data;

      if (nuevoPedido?.id_pedido) {
        navigate(
          `/home/gestion-pedidos/detalle/${nuevoPedido.id_pedido}`,
        );
      } else {
        navigate("/home/gestion-pedidos");
      }
    } catch {
      setError("Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "black" }}>Nuevo Pedido</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormPedido formData={formData} handleChange={handleChange}>
        {/* Selector de obra */}
        <div className="mb-3">
          <label className="form-label">Obra *</label>
          <SearchableSelect
            placeholder="Buscar obra por descripción..."
            value={obra.busqueda}
            onChange={obra.handleBuscar}
            suggestions={obra.sugerencias}
            onSelect={obra.seleccionar}
            renderSuggestion={(o) =>
              `${o.codigo_obra} — ${o.descripcion_obra}`
            }
            keyField="id_obra"
            selected={obra.entidadSeleccionada}
            renderSelected={(o) => (
              <span>
                <strong>{o.codigo_obra}</strong> — {o.descripcion_obra}
              </span>
            )}
            onRemove={obra.eliminarSeleccion}
          />
        </div>
      </FormPedido>

      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-pedidos")}
        >
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Guardar"}
        </Button>
      </div>
    </Card>
  );
}

export default CrearPedido;
