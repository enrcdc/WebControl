import { useState } from "react";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { contactoService } from "../services/contacto.service";
import { empresaService } from "features/empresas/services/empresa.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { SearchableSelect, SearchableMultiSelect } from "Components/ui";
import { useFormulario } from "hooks/useFormulario";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple";
import FormContacto from "./FormContacto";

const INITIAL_FORM = {
  nombre: "",
  apellido1: "",
  apellido2: "",
  dni: "",
  telefono: "",
  telefono2: "",
  email: "",
  email2: "",
  direccion: "",
  observaciones: "",
};

function CrearContacto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { formData, handleChange } = useFormulario(INITIAL_FORM);

  // Empresa (selección única, requerida)
  const empresaBusqueda = useBusquedaMultiple(
    (nombre) => empresaService.getAll({ nombre, limit: 10 }),
    { minLength: 2 },
  );
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  const handleSeleccionarEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
    empresaBusqueda.limpiar();
  };

  const handleQuitarEmpresa = () => {
    setEmpresaSeleccionada(null);
  };

  // Complejos (selección múltiple, opcional)
  const complejos = useBusquedaMultiple(
    (nombre) =>
      apiClient.get(API_ENDPOINTS.EDIFICIO, {
        params: { nombre, limit: 10 },
      }),
    { minLength: 2 },
  );

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");
    if (!empresaSeleccionada) return alert("Debes seleccionar una empresa");

    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre: formData.nombre,
        empresa: { id: empresaSeleccionada.id },
      };
      if (formData.apellido1) payload.apellido1 = formData.apellido1;
      if (formData.apellido2) payload.apellido2 = formData.apellido2;
      if (formData.dni) payload.dni = formData.dni;
      if (formData.telefono) payload.telefono = formData.telefono;
      if (formData.telefono2) payload.telefono2 = formData.telefono2;
      if (formData.email) payload.email = formData.email;
      if (formData.email2) payload.email2 = formData.email2;
      if (formData.direccion) payload.direccion = formData.direccion;
      if (formData.observaciones) payload.observaciones = formData.observaciones;
      if (complejos.seleccionados.length > 0) {
        payload.complejos = complejos.seleccionados.map((c) => ({ id: c.id }));
      }

      await contactoService.create(payload);
      navigate("/home/gestion-contactos");
    } catch {
      setError("Error al crear el contacto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "white" }}>Nuevo Contacto</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormContacto formData={formData} handleChange={handleChange}>
        {/* Empresa (requerida) */}
        <div className="mb-3">
          <label className="form-label">Empresa *</label>
          <SearchableSelect
            placeholder="Buscar empresa por nombre..."
            value={empresaBusqueda.busqueda}
            onChange={empresaBusqueda.handleBuscar}
            suggestions={empresaBusqueda.sugerencias}
            onSelect={handleSeleccionarEmpresa}
            renderSuggestion={(e) => e.nombre}
            keyField="id"
            selected={empresaSeleccionada}
            renderSelected={(e) => <strong>{e.nombre}</strong>}
            onRemove={handleQuitarEmpresa}
          />
        </div>

        {/* Complejos (opcionales) */}
        <div className="mb-3">
          <label className="form-label">Complejos asociados</label>
          <SearchableMultiSelect
            placeholder="Buscar complejo por nombre..."
            value={complejos.busqueda}
            onChange={complejos.handleBuscar}
            suggestions={complejos.sugerencias}
            onSelect={complejos.seleccionar}
            renderSuggestion={(c) => c.nombre}
            keyField="id"
            selectedItems={complejos.seleccionados}
            renderSelected={(c) => c.nombre}
            onRemove={complejos.remover}
          />
        </div>
      </FormContacto>

      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-contactos")}
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

export default CrearContacto;
