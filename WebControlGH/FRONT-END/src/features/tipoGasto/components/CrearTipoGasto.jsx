import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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

function CrearTipoGasto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tiposIva, setTiposIva] = useState([]);

  const { formData, handleChange } = useFormulario(INITIAL_FORM);

  useEffect(() => {
    const fetchTiposIva = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.TIPO_IVA);
        setTiposIva(res.data.data ?? []);
      } catch {}
    };
    fetchTiposIva();
  }, []);

  const handleGuardar = async () => {
    if (!formData.etiqueta.trim()) return alert("La etiqueta es obligatoria");
    if (!formData.descripcion.trim())
      return alert("La descripción es obligatoria");
    if (formData.importe === "") return alert("El importe es obligatorio");

    setLoading(true);
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

      await tipoGastoService.create(payload);
      navigate("/home/gestion-tipos-gasto");
    } catch {
      setError("Error al crear el tipo de gasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 mb-3">
      <div>
        <h2 style={{ color: "white" }}>Nuevo Tipo de Gasto</h2>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <FormTipoGasto
          formData={formData}
          handleChange={handleChange}
          tiposIva={tiposIva}
        />

        <div className="d-flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/home/gestion-tipos-gasto")}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Guardar"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CrearTipoGasto;
