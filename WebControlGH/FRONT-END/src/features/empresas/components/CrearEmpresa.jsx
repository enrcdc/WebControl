import { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner, Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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

function CrearEmpresa() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fdSyncWarning, setFdSyncWarning] = useState(null);

  // Form (useFormulario)
  const { formData, handleChange } = useFormulario(INITIAL_FORM);

  // Catálogo tipo factura
  const [tiposFactura, setTiposFactura] = useState([]);

  // Contactos existentes (useBusquedaMultiple)
  const contactos = useBusquedaMultiple(
    (nombre) =>
      apiClient.get(API_ENDPOINTS.CONTACTO, {
        params: { nombre, limit: 10 },
      }),
    { minLength: 2 },
  );

  // Contactos nuevos (guardado diferido)
  const [contactosNuevos, setContactosNuevos] = useState([]);
  const modalContacto = useModal();

  // Fetch catálogo tipo factura
  useEffect(() => {
    const fetchTiposFactura = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.TIPO_FACTURA);
        setTiposFactura(res.data.data ?? []);
      } catch {}
    };
    fetchTiposFactura();
  }, []);

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

  // -- Contactos: nuevo (diferido) --
  const handleNuevoContactoGuardar = (data) => {
    setContactosNuevos((prev) => [
      ...prev,
      { ...data, _tempId: `nuevo_${Date.now()}` },
    ]);
    modalContacto.handleClose();
  };

  // -- Guardar --
  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");

    const totalContactos =
      contactos.seleccionados.length + contactosNuevos.length;
    if (totalContactos === 0)
      return alert("Debes asignar al menos un contacto");

    if (contactos.seleccionados.length === 0) {
      return alert(
        "Debes seleccionar al menos un contacto existente. " +
          "Los contactos nuevos se asociarán automáticamente al guardar.",
      );
    }

    setLoading(true);
    setError(null);

    try {
      // Build payload (solo enviar campos con valor)
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
      payload.contactos = contactos.seleccionados.map((c) => c.id);

      // 1. Crear empresa con contactos existentes
      const res = await empresaService.create(payload);
      const { id_empresa: empresaId, fdSync } = res.data.data;
      if (fdSync && !fdSync.ok) {
        setFdSyncWarning(fdSync.error ?? "Error desconocido en FacturaDirecta");
      }

      // 2. Crear contactos nuevos (diferidos) asociados a la nueva empresa
      for (const contacto of contactosNuevos) {
        await apiClient.post(API_ENDPOINTS.CONTACTO, {
          nombre: contacto.nombre,
          ...(contacto.apellido1 && { apellido1: contacto.apellido1 }),
          ...(contacto.apellido2 && { apellido2: contacto.apellido2 }),
          ...(contacto.telefono && { telefono: contacto.telefono }),
          ...(contacto.email && { email: contacto.email }),
          empresa: { id: empresaId },
        });
      }

      if (!fdSync || fdSync.ok) {
        navigate("/home/gestion-empresas");
      }
      // Si fdSync falló, el warning se muestra y el usuario cierra para navegar
    } catch (err) {
      setError("Error al crear la empresa");
    } finally {
      setLoading(false);
    }
  };

  // -- Render --
  return (
    <Card className="p-3 mb-3">
      <Form.Label> Editor de empresas </Form.Label>
      <div>
        <h2 style={{ color: "white" }}>Nueva Empresa</h2>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {fdSyncWarning && (
          <Alert
            variant="warning"
            dismissible
            onClose={() => navigate("/home/gestion-empresas")}
          >
            La empresa se guardó correctamente, pero no se pudo sincronizar con
            FacturaDirecta: {fdSyncWarning}. Cierra este aviso para continuar.
          </Alert>
        )}

        <FormEmpresa
          formData={formData}
          handleChange={handleChange}
          tiposFactura={tiposFactura}
        >
          {/* Contactos de la empresa */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <label className="form-label mb-0 me-auto">
                Contactos de la Empresa *
              </label>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={modalContacto.handleOpen}
              >
                Nuevo Contacto
              </Button>
            </div>
            {/* TODO: Da un warning de "Encountered two children with the same key, `15`". Corregir*/}
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
                  {c.nombre} {c.apellido1 ?? ""}
                  {c._tempId && (
                    <Badge bg="info" className="ms-1">
                      nuevo
                    </Badge>
                  )}
                </span>
              )}
              onRemove={handleRemoverContacto}
            />
          </div>
        </FormEmpresa>

        {/* Acciones */}
        <div className="d-flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/home/gestion-empresas")}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Guardar"}
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

export default CrearEmpresa;
