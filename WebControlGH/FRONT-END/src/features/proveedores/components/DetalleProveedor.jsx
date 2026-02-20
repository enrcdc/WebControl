import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { proveedorService } from "../services/proveedor.service";
import { useFormulario } from "hooks/useFormulario";
import FormProveedor from "./FormProveedor";

const INITIAL_FORM = {
  codigo: "",
  nombre: "",
  cif: "",
  contacto: "",
  direccion: "",
  poblacion: "",
  provincia: "",
  cp: "",
  telefono1: "",
  telefono2: "",
  fax: "",
  email: "",
  evaluacion: "",
  observaciones: "",
};

const mapProveedorToForm = (proveedor) => ({
  codigo: proveedor.Codigo ?? "",
  nombre: proveedor.NombreProveedor ?? "",
  cif: proveedor.CIF ?? "",
  contacto: proveedor.PersonaContacto ?? "",
  direccion: proveedor.Direccion ?? "",
  poblacion: proveedor.Poblacion ?? "",
  provincia: proveedor.Provincia ?? "",
  cp: proveedor.CP ?? "",
  telefono1: proveedor.Tel ?? "",
  telefono2: proveedor.Telefono2 ?? "",
  fax: proveedor.Fax ?? "",
  email: proveedor.DireccionCorreoEl ?? "",
  evaluacion: proveedor.Evaluacion ?? "",
  observaciones: proveedor.observaciones ?? "",
});

function DetalleProveedor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM);
  const [formOriginal, setFormOriginal] = useState(INITIAL_FORM);

  // Fetch proveedor
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await proveedorService.getById(id);
        const proveedor = res.data.data;
        const mapped = mapProveedorToForm(proveedor);
        setFormData(mapped);
        setFormOriginal(mapped);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Proveedor no encontrado");
        } else {
          setError("Error al cargar el proveedor");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (formData.codigo) payload.codigo = formData.codigo;
      if (formData.cif) payload.cif = formData.cif;
      if (formData.contacto) payload.contacto = formData.contacto;
      if (formData.direccion) payload.direccion = formData.direccion;
      if (formData.poblacion) payload.poblacion = formData.poblacion;
      if (formData.provincia) payload.provincia = formData.provincia;
      if (formData.cp) payload.cp = formData.cp;
      if (formData.telefono1) payload.telefono1 = formData.telefono1;
      if (formData.telefono2) payload.telefono2 = formData.telefono2;
      if (formData.fax) payload.fax = formData.fax;
      if (formData.email) payload.email = formData.email;
      if (formData.evaluacion !== "")
        payload.evaluacion = Number(formData.evaluacion);
      if (formData.observaciones) payload.observaciones = formData.observaciones;

      await proveedorService.update(id, payload);
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
    if (!window.confirm("¿Dar de baja este proveedor?")) return;
    try {
      await proveedorService.delete([Number(id)]);
      navigate("/home/gestion-proveedores");
    } catch {
      setError("Error al dar de baja el proveedor");
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
        <Button onClick={() => navigate("/home/gestion-proveedores")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-3 mb-3">
      <div>
        <h2 style={{ color: "white" }}>
          Detalle de Proveedor — {formData.nombre}
        </h2>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <FormProveedor
          formData={formData}
          handleChange={handleChange}
          readOnly={!editando}
        />

        {/* Acciones */}
        <div className="d-flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/home/gestion-proveedores")}
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
            {editando ? "Cancelar" : "Baja Proveedor"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default DetalleProveedor;
