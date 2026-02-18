import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
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

const mapComplejoToForm = (c) => ({
  nombre: c.nombre ?? "",
  direccion: c.direccion ?? "",
  telefono1: c.telefono1 ?? "",
  telefono2: c.telefono2 ?? "",
  email: c.email ?? "",
  observaciones: c.observaciones ?? "",
  porDefecto: !!c.porDefecto,
});

function DetalleComplejo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM);
  const [formOriginal, setFormOriginal] = useState(INITIAL_FORM);

  // Contactos actuales del complejo (para vista lectura)
  const [contactosList, setContactosList] = useState([]);

  // Contactos seleccionados en modo edición (useBusquedaMultiple)
  const contactos = useBusquedaMultiple(
    (nombre) =>
      apiClient.get(API_ENDPOINTS.CONTACTO, {
        params: { nombre, limit: 10 },
      }),
    { minLength: 2 },
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resComplejo, resContactos] = await Promise.all([
          complejoService.getAll({ idEdificio: id }),
          apiClient.get(API_ENDPOINTS.CONTACTO, {
            params: { idEdificio: id, limit: 100, mostrarBaja: 1 },
          }),
        ]);

        const complejo = resComplejo.data.data?.[0];
        if (!complejo) throw new Error("not_found");

        const mapped = mapComplejoToForm(complejo);
        setFormData(mapped);
        setFormOriginal(mapped);

        const contactosData = resContactos.data.data ?? [];
        setContactosList(contactosData);
        contactos.setSeleccionados(contactosData);
      } catch (err) {
        if (
          err.message === "not_found" ||
          err.response?.status === 404
        ) {
          setError("Complejo no encontrado");
        } else {
          setError("Error al cargar el complejo");
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
    contactos.setSeleccionados(contactosList);
    setEditando(false);
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");
    if (contactos.seleccionados.length === 0)
      return alert("Debes asignar al menos un contacto");

    setSaving(true);
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

      await complejoService.update(id, payload);
      setFormOriginal({ ...formData });
      setContactosList([...contactos.seleccionados]);
      setEditando(false);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleBaja = async () => {
    if (!window.confirm("¿Dar de baja este complejo?")) return;
    try {
      await complejoService.delete([Number(id)]);
      navigate("/home/gestion-complejos");
    } catch {
      setError("Error al dar de baja el complejo");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error && !formData.nombre) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate("/home/gestion-complejos")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "white" }}>Detalle de Complejo — {formData.nombre}</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormComplejo
        formData={formData}
        handleChange={handleChange}
        readOnly={!editando}
      >
        {/* Contactos del complejo */}
        <div className="mb-3">
          <label className="form-label">Contactos del Complejo *</label>
          {editando ? (
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
          ) : contactosList.length === 0 ? (
            <p className="text-muted">Sin contactos asignados</p>
          ) : (
            <ListGroup>
              {contactosList.map((c) => (
                <ListGroup.Item key={c.id}>
                  {c.nombre} {c.apellido1 ?? ""} {c.apellido2 ?? ""}
                  {c.telefono && ` — ${c.telefono}`}
                  {c.email && ` — ${c.email}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </FormComplejo>

      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-complejos")}
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
          {editando ? "Cancelar" : "Baja Complejo"}
        </Button>
      </div>
    </Card>
  );
}

export default DetalleComplejo;
