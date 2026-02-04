// ESTE ARCHIVO CONTIENE LA MODAL DE PEDIDOS PARAMETRIZADA
import { Modal, Form, Button } from "react-bootstrap";

const ModalContacto = ({
  show,
  formData,
  busquedaComplejo,
  sugerenciasComplejos,
  complejoSeleccionado,
  onBuscarComplejo,
  OnSeleccionarComplejo,
  OnEliminarComplejo,
  onHide,
  onChangeForm,
  onGuardar,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={formData.nombre || ""}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Apellido 1</Form.Label>
            <Form.Control
              name="apellido1"
              value={formData.apellido1}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Apellido 2</Form.Label>
            <Form.Control
              name="apellido2"
              value={formData.apellido2}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>DNI/NIE</Form.Label>
            <Form.Control
              name="dni"
              value={formData.dni}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              name="telefono"
              value={formData.telefono}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Teléfono 2</Form.Label>
            <Form.Control
              name="telefono2"
              value={formData.telefono2}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={formData.email}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email 2</Form.Label>
            <Form.Control
              name="email2"
              value={formData.email2}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="direccion"
              value={formData.direccion}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              name="porDefecto"
              label="Por defecto"
              checked={formData.porDefecto}
              onChange={onChangeForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Empresa del Contacto</Form.Label>
            <Form.Control
              name="empresa"
              defaultValue={formData.empresa}
              readOnly={true}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Complejo del Contacto:</Form.Label>
            <div className="mb-2 position-relative">
              <Form.Control
                type="text"
                placeholder="Buscar complejo por nombre..."
                value={busquedaComplejo}
                onChange={onBuscarComplejo}
                autoComplete="off"
              />
              {/* Sugerencias productos*/}
              {sugerenciasComplejos.length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{ zIndex: 10 }}
                >
                  {sugerenciasComplejos.map((complejo) => (
                    <li
                      key={complejo.id_edificio}
                      className="list-group-item list-group-item-action"
                      onClick={() => OnSeleccionarComplejo(complejo)}
                      style={{ cursor: "pointer" }}
                    >
                      {complejo.nombre}
                    </li>
                  ))}
                </ul>
              )}
              {/* Complejo seleccionado */}
              {complejoSeleccionado && (
                <div className="mt-2">
                  <span>
                    <strong>Complejo:</strong>{" "}
                    {complejoSeleccionado.nombre}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={OnEliminarComplejo}
                  >
                    Quitar
                  </Button>
                </div>
              )}
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              name="observaciones"
              value={formData.observaciones}
              onChange={onChangeForm}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalContacto;
