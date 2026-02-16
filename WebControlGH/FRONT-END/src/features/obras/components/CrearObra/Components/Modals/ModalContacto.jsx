// ESTE ARCHIVO CONTIENE LA MODAL DE CONTACTOS PARAMETRIZADA
import { Modal, Form, Button, ListGroup } from "react-bootstrap";
import {
  SearchableSelect,
  SearchableMultiSelect,
} from "../../../../../../Components/ui";

const ModalContacto = ({
  show,
  formData,

  busquedaComplejos,
  sugerenciasComplejos,
  onBuscarComplejo,
  onSeleccionarComplejo,
  onEliminarComplejo,

  busquedaEmpresa,
  sugerenciasEmpresas,
  onBuscarEmpresa,
  onSeleccionarEmpresa,
  onEliminarEmpresa,

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
          <Form.Group className="mb-2">
            <Form.Label>Empresa del Contacto:</Form.Label>
            <SearchableSelect
              placeholder={"Buscar empresa por nombre..."}
              value={busquedaEmpresa}
              onChange={onBuscarEmpresa}
              suggestions={sugerenciasEmpresas}
              onSelect={onSeleccionarEmpresa}
              renderSuggestion={(e) => e.nombre}
              keyField="id"
              selected={formData.empresa}
              renderSelected={(e) => (
                <>
                  <strong>Empresa:</strong> {formData.empresa.nombre}
                </>
              )}
              onRemove={onEliminarEmpresa}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Complejo del Contacto:</Form.Label>
            <SearchableMultiSelect
              placeholder={"Buscar compljejo por nombre..."}
              value={busquedaComplejos}
              onChange={onBuscarComplejo}
              suggestions={sugerenciasComplejos}
              onSelect={onSeleccionarComplejo}
              renderSuggestion={(c) => c.nombre}
              keyField="id"
              selectedItems={formData.complejos || []}
              renderSelected={(c) => <span>{c.nombre}</span>}
              onRemove={(c) => onEliminarComplejo(c)}
            />
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
