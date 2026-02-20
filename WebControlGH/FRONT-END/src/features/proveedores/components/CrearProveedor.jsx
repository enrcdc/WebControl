import { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { proveedorService } from "../services/proveedor.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
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
  tipoFactura: "",
  evaluacion: "",
  observaciones: "",
};

function CrearProveedor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { formData, handleChange, setFormData } = useFormulario(INITIAL_FORM);

  // Catálogo tipo factura
  const [tiposFactura, setTiposFactura] = useState([]);

  // Obtener el siguiente código de proveedor y el catálogo de tipos de factura al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [codigoRes, tiposRes] = await Promise.all([
          proveedorService.getUltimoCodigo(),
          apiClient.get(API_ENDPOINTS.TIPO_FACTURA),
        ]);
        const siguienteCodigo = codigoRes.data?.data?.siguienteCodigo;
        if (siguienteCodigo != null) {
          setFormData((prev) => ({ ...prev, codigo: String(siguienteCodigo) }));
        }
        setTiposFactura(tiposRes.data.data ?? []);
      } catch {}
    };
    fetchData();
  }, [setFormData]);

  // -- Guardar --
  const handleGuardar = async () => {
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: formData.nombre,
        codigo: formData.codigo,
      };
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
      if (formData.tipoFactura) payload.tipoFactura = Number(formData.tipoFactura);
      if (formData.evaluacion !== "")
        payload.evaluacion = Number(formData.evaluacion);
      if (formData.observaciones)
        payload.observaciones = formData.observaciones;

      await proveedorService.create(payload);
      navigate("/home/gestion-proveedores");
    } catch {
      setError("Error al crear el proveedor");
    } finally {
      setLoading(false);
    }
  };

  // -- Render --
  return (
    <Card className="p-3 mb-3">
      <div>
        <h2 style={{ color: "white" }}>Nuevo Proveedor</h2>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <FormProveedor
          formData={formData}
          handleChange={handleChange}
          tiposFactura={tiposFactura}
        />

        {/* Acciones */}
        <div className="d-flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/home/gestion-proveedores")}
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

export default CrearProveedor;
