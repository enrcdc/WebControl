import { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Spinner,
  Card,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { empresaService } from "../services/empresa.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { SearchableMultiSelect } from "Components/ui";
import { useFormulario } from "hooks/useFormulario";
import { useModal } from "hooks/useModal";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple";
import FormEmpresa from "./FormEmpresa";
import ModalNuevoContacto from "./ModalNuevoContacto";

const INITIAL_FORM = {
  nombre: "",
  cif: "",
  tipoEmpresa: "",
  direccion: "",
  poblacion: "",
  provincia: "",
  cp: "",
  telefono1: "",
  telefono2: "",
  fax: "",
  email: "",
  tipoFactura: "",
  evaluacion: "",
  observaciones: "",
  mostrarSaldo: 0,
  porDefecto: 0,
};

const mapEmpresaToForm = (empresa) => ({
  nombre: empresa.nombre ?? "",
  cif: empresa.cif ?? "",
  tipoEmpresa: empresa.tipo_empresa ?? "",
  direccion: empresa.direccion ?? "",
  poblacion: empresa.poblacion ?? "",
  provincia: empresa.provincia ?? "",
  cp: empresa.cp ?? "",
  telefono1: empresa.telefono1 ?? "",
  telefono2: empresa.telefono2 ?? "",
  fax: empresa.fax ?? "",
  email: empresa.email ?? "",
  tipoFactura: empresa.tipo_factura ?? "",
  evaluacion: empresa.evaluacion ?? "",
  observaciones: empresa.observaciones ?? "",
  mostrarSaldo: empresa.mostrar_saldo ?? 0,
  porDefecto: empresa.pordefecto ?? 0,
});

function DetalleEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  // Form
  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM);
  const [formOriginal, setFormOriginal] = useState(INITIAL_FORM);

  // Catálogo tipo factura
  const [tiposFactura, setTiposFactura] = useState([]);

  // Contactos: vista lectura (snapshot al cargar / guardar)
  const [contactosList, setContactosList] = useState([]);

  // Contactos: búsqueda + selección existentes (modo edición)
  const contactos = useBusquedaMultiple(
    (nombre) =>
      apiClient.get(API_ENDPOINTS.CONTACTO, {
        params: { nombre, limit: 10 },
      }),
    { minLength: 2 },
  );

  // Contactos: nuevos (guardado diferido)
  const [contactosNuevos, setContactosNuevos] = useState([]);
  const modalContacto = useModal();

  // Fetch empresa + contactos + catálogo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resEmpresa, resTiposFactura] = await Promise.all([
          empresaService.getById(id),
          apiClient.get(API_ENDPOINTS.TIPO_FACTURA),
        ]);

        const empresa = resEmpresa.data.data;
        const mapped = mapEmpresaToForm(empresa);
        setFormData(mapped);
        setFormOriginal(mapped);

        // Asignación de contactos
        setContactosList(
          empresa.contactos.map((c) => ({
            id: c.id,
            nombre: c.nombre,
            apellido1: c.apellido1,
            apellido2: c.apellido2,
          })),
        );
        contactos.setSeleccionados(empresa.contactos);

        // Asignación de tipos de factura
        setTiposFactura(resTiposFactura.data.data ?? []);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Empresa no encontrada");
        } else {
          setError("Error al cargar la empresa");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // -- Contactos: lista combinada (existentes + nuevos) --
  const todosContactos = [
    ...contactos.seleccionados,
    ...contactosNuevos.map((c) => ({ ...c, id: c._tempId })),
  ];

  const handleRemoverContacto = (contacto) => {
    if (contacto._tempId) {
      setContactosNuevos((prev) =>
        prev.filter((c) => c._tempId !== contacto._tempId),
      );
    } else {
      contactos.remover(contacto);
    }
  };

  const handleNuevoContactoGuardar = (data) => {
    setContactosNuevos((prev) => [
      ...prev,
      { ...data, _tempId: `nuevo_${Date.now()}` },
    ]);
    modalContacto.handleClose();
  };

  // -- Editar / Cancelar --
  const handleCancelar = () => {
    setFormData(formOriginal);
    contactos.setSeleccionados(contactosList);
    setContactosNuevos([]);
    setEditando(false);
  };

  // -- Guardar --
  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");

    const totalContactos =
      contactos.seleccionados.length + contactosNuevos.length;
    if (totalContactos === 0)
      return alert("Debes asignar al menos un contacto");

    setSaving(true);
    setError(null);

    try {
      // 1. Crear contactos nuevos (diferidos) y recoger sus IDs
      const nuevosIds = [];
      for (const contacto of contactosNuevos) {
        const res = await apiClient.post(API_ENDPOINTS.CONTACTO, {
          nombre: contacto.nombre,
          ...(contacto.apellido1 && { apellido1: contacto.apellido1 }),
          ...(contacto.apellido2 && { apellido2: contacto.apellido2 }),
          ...(contacto.telefono && { telefono: contacto.telefono }),
          ...(contacto.email && { email: contacto.email }),
          empresa: { id: Number(id) },
        });
        const nuevoId = res.data.data?.id_contacto ?? res.data.data?.id;
        if (nuevoId) nuevosIds.push(nuevoId);
      }

      // 2. Combinar IDs existentes + nuevos
      const existentesIds = contactos.seleccionados.map(
        (c) => c.id_contacto ?? c.id,
      );
      const todosIds = [...existentesIds, ...nuevosIds];

      // 3. Build payload y actualizar empresa
      const payload = { nombre: formData.nombre };
      if (formData.cif) payload.cif = formData.cif;
      if (formData.tipoEmpresa)
        payload.tipoEmpresa = Number(formData.tipoEmpresa);
      if (formData.direccion) payload.direccion = formData.direccion;
      if (formData.poblacion) payload.poblacion = formData.poblacion;
      if (formData.provincia) payload.provincia = formData.provincia;
      if (formData.cp) payload.cp = formData.cp;
      if (formData.telefono1) payload.telefono1 = formData.telefono1;
      if (formData.telefono2) payload.telefono2 = formData.telefono2;
      if (formData.fax) payload.fax = formData.fax;
      if (formData.email) payload.email = formData.email;
      if (formData.tipoFactura)
        payload.tipoFactura = Number(formData.tipoFactura);
      if (formData.evaluacion !== "")
        payload.evaluacion = Number(formData.evaluacion);
      if (formData.observaciones)
        payload.observaciones = formData.observaciones;
      payload.mostrarSaldo = formData.mostrarSaldo ? 1 : 0;
      payload.porDefecto = formData.porDefecto ? 1 : 0;
      payload.contactos = todosIds;

      await empresaService.update(id, payload);

      // 4. Refrescar estado local tras guardado exitoso
      const resContactos = await apiClient.get(API_ENDPOINTS.CONTACTO, {
        params: { idsEmpresa: id, mostrarBaja: 1 },
      });
      const contactosActualizados = resContactos.data.data ?? [];
      setContactosList(contactosActualizados);
      contactos.setSeleccionados(contactosActualizados);
      setContactosNuevos([]);

      setFormOriginal({ ...formData });
      setEditando(false);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // -- Baja --
  const handleBaja = async () => {
    if (!window.confirm("¿Dar de baja esta empresa?")) return;
    try {
      await empresaService.delete([Number(id)]);
      navigate("/home/gestion-empresas");
    } catch {
      setError("Error al dar de baja la empresa");
    }
  };

  // -- Loading / Error --
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
        <Button onClick={() => navigate("/home/gestion-empresas")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <div>
        <h2 style={{ color: "white" }}>
          Detalle de Empresa — {formData.nombre}
        </h2>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <FormEmpresa
          formData={formData}
          handleChange={handleChange}
          readOnly={!editando}
          tiposFactura={tiposFactura}
        >
          {/* Contactos de la empresa */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <label className="form-label mb-0 me-auto">
                Contactos de la Empresa *
              </label>
              {editando && (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={modalContacto.handleOpen}
                >
                  Nuevo Contacto
                </Button>
              )}
            </div>
            {editando ? (
              <SearchableMultiSelect
                placeholder="Buscar contacto por nombre..."
                value={contactos.busqueda}
                onChange={contactos.handleBuscar}
                suggestions={contactos.sugerencias}
                onSelect={contactos.seleccionar}
                renderSuggestion={(c) =>
                  `${c.nombre} ${c.apellido1 ?? ""} ${c.nombreEmpresas ? `(${c.nombreEmpresas})` : ""}`.trim()
                }
                keyField="id"
                selectedItems={todosContactos}
                renderSelected={(c) => (
                  <span>
                    {c.nombre} {c.apellido1 ?? ""} {c.apellido2 ?? ""}
                    {c._tempId && (
                      <Badge bg="info" className="ms-1">
                        nuevo
                      </Badge>
                    )}
                  </span>
                )}
                onRemove={handleRemoverContacto}
              />
            ) : contactosList.length === 0 ? (
              <p className="text-muted">Sin contactos asignados</p>
            ) : (
              <ListGroup>
                {contactosList.map((c) => (
                  <ListGroup.Item key={c.id_contacto ?? c.id}>
                    {c.nombre} {c.apellido1 ?? ""} {c.apellido2 ?? ""}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </FormEmpresa>

        {/* Acciones */}
        <div className="d-flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/home/gestion-empresas")}
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
            {editando ? "Cancelar" : "Baja Empresa"}
          </Button>
        </div>

        <ModalNuevoContacto
          show={modalContacto.show}
          onHide={modalContacto.handleClose}
          onGuardar={handleNuevoContactoGuardar}
        />
      </div>
    </Card>
  );
}

export default DetalleEmpresa;
