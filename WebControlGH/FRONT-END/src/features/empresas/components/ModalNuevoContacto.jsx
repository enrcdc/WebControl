import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useModal } from "hooks/useModal";
import { useFormulario } from "hooks/useFormulario";

const INITIAL_CONTACTO = {
  nombre: "",
  apellido1: "",
  apellido2: "",
  telefono: "",
  email: "",
};

function ModalNuevoContacto({ show, onHide, onGuardar }) {
  const { formData, handleChange, resetForm, setFormData } =
    useFormulario(INITIAL_CONTACTO);

  const handleGuardar = () => {
    if (!formData.nombre.trim())
      return alert("El nombre del contacto es obligatorio");
    onGuardar({ ...formData });
    setFormData(INITIAL_CONTACTO);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              name="apellido1"
              value={formData.apellido1}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              name="apellido2"
              value={formData.apellido2}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Añadir Contacto
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalNuevoContacto;
