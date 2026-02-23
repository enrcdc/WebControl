import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { tipoGastoService } from "../services/tipoGasto.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { useFormulario } from "hooks/useFormulario";
import FormTipoGasto from "./FormTipoGasto";

const INITIAL_FORM = {
  etiqueta: "",
  descripcion: "",
  importe: "",
  porcentaje: "",
  tipoIva: "",
  conHoras: "",
  esHoraExtra: "",
  observaciones: "",
};

const mapTipoGastoToForm = (tg) => ({
  etiqueta: tg.etiqueta ?? "",
  descripcion: tg.descripcion ?? "",
  importe: tg.importe ?? "",
  porcentaje: tg.porcentaje ?? "",
  tipoIva: tg.id_tipoiva ?? "",
  conHoras: tg.conhoras ?? "",
  esHoraExtra: tg.eshoraextra ?? "",
  observaciones: tg.observaciones ?? "",
});

function DetalleTipoGasto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);
  const [tiposIva, setTiposIva] = useState([]);

  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM);
  const [formOriginal, setFormOriginal] = useState(INITIAL_FORM);

  // Fetch catálogo tipos de IVA
  useEffect(() => {
    const fetchTiposIva = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.TIPO_IVA);
        setTiposIva(res.data.data ?? []);
      } catch {}
    };
    fetchTiposIva();
  }, []);

  // Fetch tipo de gasto
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await tipoGastoService.getById(id);
        const tg = res.data.data;
        const mapped = mapTipoGastoToForm(tg);
        setFormData(mapped);
        setFormOriginal(mapped);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Tipo de gasto no encontrado");
        } else {
          setError("Error al cargar el tipo de gasto");
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
    if (!formData.etiqueta.trim()) return alert("La etiqueta es obligatoria");
    if (!formData.descripcion.trim())
      return alert("La descripción es obligatoria");
    if (formData.importe === "") return alert("El importe es obligatorio");

    setSaving(true);
    setError(null);

    try {
      const payload = {
        etiqueta: formData.etiqueta,
        descripcion: formData.descripcion,
        importe: Number(formData.importe),
      };
      if (formData.porcentaje !== "")
        payload.porcentaje = Number(formData.porcentaje);
      if (formData.tipoIva !== "") payload.tipoIva = Number(formData.tipoIva);
      if (formData.conHoras !== "")
        payload.conHoras = Number(formData.conHoras);
      if (formData.esHoraExtra !== "")
        payload.esHoraExtra = Number(formData.esHoraExtra);
      if (formData.observaciones) payload.observaciones = formData.observaciones;

      await tipoGastoService.update(id, payload);
      setFormOriginal({ ...formData });
      setEditando(false);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleBaja = async () => {
    if (!window.confirm("¿Dar de baja este tipo de gasto?")) return;
    try {
      await tipoGastoService.delete([Number(id)]);
      navigate("/home/gestion-tipos-gasto");
    } catch {
      setError("Error al dar de baja el tipo de gasto");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error && !formData.etiqueta) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate("/home/gestion-tipos-gasto")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <div>
        <h2 style={{ color: "white" }}>
          Detalle de Tipo de Gasto — {formData.etiqueta}
        </h2>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <FormTipoGasto
          formData={formData}
          handleChange={handleChange}
          readOnly={!editando}
          tiposIva={tiposIva}
        />

        <div className="d-flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/home/gestion-tipos-gasto")}
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
            {editando ? "Cancelar" : "Baja Tipo de Gasto"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default DetalleTipoGasto;
