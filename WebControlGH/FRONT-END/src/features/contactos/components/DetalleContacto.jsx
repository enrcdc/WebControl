import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { contactoService } from "../services/contacto.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { SearchableMultiSelect } from "Components/ui";
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

const mapContactoToForm = (c) => ({
  nombre: c.nombre ?? "",
  apellido1: c.apellido1 ?? "",
  apellido2: c.apellido2 ?? "",
  dni: c.dni ?? "",
  telefono: c.telefono ?? "",
  telefono2: c.telefono2 ?? "",
  email: c.email ?? "",
  email2: c.email2 ?? "",
  direccion: c.direccion ?? "",
  observaciones: c.observaciones ?? "",
});

function DetalleContacto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM);
  const [formOriginal, setFormOriginal] = useState(INITIAL_FORM);

  // Empresa del contacto (inmutable, solo lectura)
  const [empresa, setEmpresa] = useState(null);

  // Complejos actuales del contacto (para vista lectura)
  const [complejosList, setComplejosList] = useState([]);

  // Complejos seleccionados en modo edición
  const complejos = useBusquedaMultiple(
    (nombre) =>
      apiClient.get(API_ENDPOINTS.EDIFICIO, {
        params: { nombre, limit: 10 },
      }),
    { minLength: 2 },
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resContacto, resComplejos] = await Promise.all([
          // getAll con idContacto retorna empresa via join
          contactoService.getAll({ idContacto: id }),
          apiClient.get(API_ENDPOINTS.EDIFICIO, {
            params: { idContacto: id, limit: 100, mostrarBaja: 1 },
          }),
        ]);

        const contacto = resContacto.data.data?.[0];
        if (!contacto) throw new Error("not_found");

        const mapped = mapContactoToForm(contacto);
        setFormData(mapped);
        setFormOriginal(mapped);
        setEmpresa(
          contacto.idEmpresa
            ? { id: contacto.idEmpresa, nombre: contacto.nombre_empresa }
            : null,
        );

        const complejosData = resComplejos.data.data ?? [];
        setComplejosList(complejosData);
        complejos.setSeleccionados(complejosData);
      } catch (err) {
        if (
          err.message === "not_found" ||
          err.response?.status === 404
        ) {
          setError("Contacto no encontrado");
        } else {
          setError("Error al cargar el contacto");
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
    complejos.setSeleccionados(complejosList);
    setEditando(false);
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");

    setSaving(true);
    setError(null);
    try {
      const payload = { nombre: formData.nombre };
      if (formData.apellido1) payload.apellido1 = formData.apellido1;
      if (formData.apellido2) payload.apellido2 = formData.apellido2;
      if (formData.dni) payload.dni = formData.dni;
      if (formData.telefono) payload.telefono = formData.telefono;
      if (formData.telefono2) payload.telefono2 = formData.telefono2;
      if (formData.email) payload.email = formData.email;
      if (formData.email2) payload.email2 = formData.email2;
      if (formData.direccion) payload.direccion = formData.direccion;
      if (formData.observaciones) payload.observaciones = formData.observaciones;
      payload.complejos = complejos.seleccionados.map((c) => ({ id: c.id }));

      await contactoService.update(id, payload);
      setFormOriginal({ ...formData });
      setComplejosList([...complejos.seleccionados]);
      setEditando(false);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleBaja = async () => {
    if (!window.confirm("¿Dar de baja este contacto?")) return;
    try {
      await contactoService.delete([Number(id)]);
      navigate("/home/gestion-contactos");
    } catch {
      setError("Error al dar de baja el contacto");
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
        <Button onClick={() => navigate("/home/gestion-contactos")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <h2 style={{ color: "white" }}>
        Detalle de Contacto — {formData.nombre} {formData.apellido1}
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormContacto
        formData={formData}
        handleChange={handleChange}
        readOnly={!editando}
      >
        {/* Empresa (siempre de lectura) */}
        <div className="mb-3">
          <label className="form-label">Empresa</label>
          <p className="form-control-plaintext">
            {empresa?.nombre ?? <span className="text-muted">Sin empresa</span>}
          </p>
        </div>

        {/* Complejos */}
        <div className="mb-3">
          <label className="form-label">Complejos asociados</label>
          {editando ? (
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
          ) : complejosList.length === 0 ? (
            <p className="text-muted">Sin complejos asociados</p>
          ) : (
            <ListGroup>
              {complejosList.map((c) => (
                <ListGroup.Item key={c.id}>
                  {c.nombre}
                  {c.direccion && ` — ${c.direccion}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </FormContacto>

      <div className="d-flex gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home/gestion-contactos")}
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
          {editando ? "Cancelar" : "Baja Contacto"}
        </Button>
      </div>
    </Card>
  );
}

export default DetalleContacto;
