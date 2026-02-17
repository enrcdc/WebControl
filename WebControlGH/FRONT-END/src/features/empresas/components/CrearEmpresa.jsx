import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../services/empresa.service";
import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";
import { SearchableMultiSelect } from "Components/ui";
import { useFormulario } from "hooks/useFormulario";
import { useModal } from "hooks/useModal";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple";
import ModalNuevoContacto from "./ModalNuevoContacto";

// TODO: Mover a catálogo de BBDD en el futuro si es que aumenta
const TIPOS_EMPRESA = [
  { id: 1, descripcion: "Sin Especificar" },
  { id: 3, descripcion: "Cliente" },
];

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
    apiClient
      .get(API_ENDPOINTS.TIPO_FACTURA)
      .then((res) => setTiposFactura(res.data.data ?? []))
      .catch(() => {});
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
      const empresaId = res.data.data.id_empresa;

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

      navigate("/home/gestion-empresas");
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

        <Form>
          {/* Datos básicos */}
          <Row>
            <Col md={5}>
              <Form.Group className="mb-2">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>CIF</Form.Label>
                <Form.Control
                  name="cif"
                  value={formData.cif}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Tipo de Empresa</Form.Label>
                <Form.Select
                  name="tipoEmpresa"
                  value={formData.tipoEmpresa}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  {TIPOS_EMPRESA.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Dirección */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Población</Form.Label>
                <Form.Control
                  name="poblacion"
                  value={formData.poblacion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  name="cp"
                  value={formData.cp}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Contacto empresa */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Teléfono 1</Form.Label>
                <Form.Control
                  name="telefono1"
                  value={formData.telefono1}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Teléfono 2</Form.Label>
                <Form.Control
                  name="telefono2"
                  value={formData.telefono2}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Fax</Form.Label>
                <Form.Control
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Facturación */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Tipo de Factura</Form.Label>
                <Form.Select
                  name="tipoFactura"
                  value={formData.tipoFactura}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  {tiposFactura.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.Descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Evaluación</Form.Label>
                <Form.Control
                  name="evaluacion"
                  type="number"
                  value={formData.evaluacion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Opciones */}
          <Row className="mb-3">
            <Col>
              <Form.Check
                type="checkbox"
                name="mostrarSaldo"
                label="Mostrar Saldo"
                checked={!!formData.mostrarSaldo}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                name="porDefecto"
                label="Por Defecto"
                checked={!!formData.porDefecto}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Observaciones */}
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Contactos de la empresa */}
          <Form.Group className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <Form.Label className="mb-0 me-auto">
                Contactos de la Empresa *
              </Form.Label>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={modalContacto.handleOpen}
              >
                Nuevo Contacto
              </Button>
            </div>
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
          </Form.Group>

          {/* Acciones */}
          <div className="d-flex gap-2 mb-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/home/gestion-empresas")}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardar}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Guardar"}
            </Button>
          </div>
        </Form>

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
