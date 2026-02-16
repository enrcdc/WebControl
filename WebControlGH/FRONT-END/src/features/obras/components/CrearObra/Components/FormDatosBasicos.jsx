// Componente presentacional para los datos básicos de la obra (código, descripción, seguimiento)
import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const FormDatosBasicos = ({
  formObra,
  enSeguimiento,
  onChangeForm,
  onChangeSeguimiento,
}) => {
  return (
    <fieldset>
      <legend>Editor de Obra</legend>

      <Form.Group as={Row} controlId="cod">
        <Form.Label column sm="2">
          <strong>Código:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="cod"
            value={formObra.cod}
            onChange={onChangeForm}
            placeholder="código de obra"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="descripcion">
        <Form.Label column sm="2">
          <strong>Descripción</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="desc"
            value={formObra.desc}
            onChange={onChangeForm}
            placeholder="descripción de obra"
          />
        </Col>
      </Form.Group>

      <Form.Check
        type="checkbox"
        label="En Seguimiento"
        checked={enSeguimiento}
        onChange={onChangeSeguimiento}
        className="mt-3"
      />

      {enSeguimiento && (
        <>
          <Form.Group as={Row} controlId="fSeg">
            <Form.Label column sm="2">
              Fecha Seguimiento:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="date"
                name="fechaSeg"
                value={formObra.fechaSeg}
                onChange={onChangeForm}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="descripcionSeg">
            <Form.Label column sm="2">
              Motivo:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="descSeg"
                value={formObra.descSeg}
                onChange={onChangeForm}
              />
            </Col>
          </Form.Group>
        </>
      )}
    </fieldset>
  );
};

export default FormDatosBasicos;
