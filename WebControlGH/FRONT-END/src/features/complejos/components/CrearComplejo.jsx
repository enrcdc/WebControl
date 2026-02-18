import { useState } from "react";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { complejoService } from "../services/complejo.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { SearchableMultiSelect } from "Components/ui";
import { useFormulario } from "hooks/useFormulario";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple";
import FormComplejo from "./FormComplejo";

const INITIAL_FORM = {
  nombre: "",
  direccion: "",
  telefono1: "",
  telefono2: "",
  email: "",
  observaciones: "",
  porDefecto: false,
};

function CrearComplejo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { formData, handleChange } = useFormulario(INITIAL_FORM);

  const contactos = useBusquedaMultiple(
    (nombre) =>
      apiClient.get(API_ENDPOINTS.CONTACTO, {
        params: { nombre, limit: 10 },
      }),
    { minLength: 2 },
  );

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");
    if (contactos.seleccionados.length === 0)
      return alert("Debes asignar al menos un contacto");

    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre: formData.nombre,
        contactos: contactos.seleccionados.map((c) => c.id),
      };
      if (formData.direccion) payload.direccion = formData.direccion;
      if (formData.telefono1) payload.telefono1 = formData.telefono1;
      if (formData.telefono2) payload.telefono2 = formData.telefono2;
      if (formData.email) payload.email = formData.email;
      if (formData.observaciones) payload.observaciones = formData.observaciones;
      payload.porDefecto = formData.porDefecto ? 1 : 0;

      await complejoService.create(payload);
      navigate("/home/gestion-complejos");
    } catch {
      setError("Error al crear el complejo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "white" }}>Nuevo Complejo</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormComplejo formData={formData} handleChange={handleChange}>
        {/* Contactos del complejo */}
        <div className="mb-3">
          <label className="form-label">Contactos del Complejo *</label>
          <SearchableMultiSelect
            placeholder="Buscar contacto por nombre..."
            value={contactos.busqueda}
            onChange={contactos.handleBuscar}
            suggestions={contactos.sugerencias}
            onSelect={contactos.seleccionar}
            renderSuggestion={(c) =>
              `${c.nombre} ${c.apellido1 ?? ""} ${c.nombre_empresa ? `(${c.nombre_empresa})` : ""}`.trim()
            }
            keyField="id"
            selectedItems={contactos.seleccionados}
            renderSelected={(c) =>
              `${c.nombre} ${c.apellido1 ?? ""}`.trim()
            }
            onRemove={contactos.remover}
          />
        </div>
      </FormComplejo>

      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-complejos")}
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

export default CrearComplejo;
