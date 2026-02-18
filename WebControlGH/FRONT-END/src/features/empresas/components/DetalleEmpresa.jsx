import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { empresaService } from "../services/empresa.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { useFormulario } from "hooks/useFormulario";
import FormEmpresa from "./FormEmpresa";

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

/**
 * Mapea los campos snake_case del backend a camelCase del formulario.
 */
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

  // Contactos de la empresa
  const [contactos, setContactos] = useState([]);

  // Fetch empresa + contactos + catálogo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resEmpresa, resContactos, resTiposFactura] = await Promise.all([
          empresaService.getById(id),
          apiClient.get(`${API_ENDPOINTS.CONTACTO}?idEmpresa=${id}`),
          apiClient.get(API_ENDPOINTS.TIPO_FACTURA),
        ]);

        const empresa = resEmpresa.data.data;
        const mapped = mapEmpresaToForm(empresa);
        setFormData(mapped);
        setFormOriginal(mapped);
        setContactos(resContactos.data.data ?? []);
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
  }, [id]);

  // -- Editar / Cancelar --
  const handleCancelar = () => {
    setFormData(formOriginal);
    setEditando(false);
  };

  // -- Guardar --
  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");

    setSaving(true);
    setError(null);

    try {
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
      payload.contactos = contactos.map((c) => c.id_contacto ?? c.id);

      await empresaService.update(id, payload);
      setFormOriginal({ ...formData });
      setEditando(false);
    } catch (err) {
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
    } catch (err) {
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
          {/* TODO: Contactos solo de lectura. Dar la posibilidad de añadir o quitar*/}
          <div className="mb-3">
            <label className="form-label">Contactos de la Empresa</label>
            {contactos.length === 0 ? (
              <p className="text-muted">Sin contactos asignados</p>
            ) : (
              <ListGroup>
                {contactos.map((c) => (
                  <ListGroup.Item key={c.id_contacto ?? c.id}>
                    {c.nombre} {c.apellido1 ?? ""} {c.apellido2 ?? ""}
                    {c.telefono && ` — ${c.telefono}`}
                    {c.email && ` — ${c.email}`}
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
      </div>
    </Card>
  );
}

export default DetalleEmpresa;
