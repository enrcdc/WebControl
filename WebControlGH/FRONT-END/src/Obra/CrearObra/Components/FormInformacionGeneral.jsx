// Componente presentacional para la información general de la obra
import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const FormInformacionGeneral = ({
  formObra,
  catalogos,
  ofertado,
  onChangeForm,
  onChangeOfertado,
  onAgregarContacto,
}) => {
  return (
    <fieldset>
      <legend>Información General</legend>

      <Form.Group as={Row} controlId="tipo">
        <Form.Label column sm="2">
          <strong>Tipo de Obra:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="tipoObra"
            value={formObra.tipoObra}
            onChange={onChangeForm}
          >
            <option value="">Seleccionar...</option>
            {catalogos?.tiposObra?.length > 0 ? (
              catalogos.tiposObra.map((tipo) => (
                <option key={tipo.id_tipo} value={tipo.id_tipo}>
                  {tipo.descripcion}
                </option>
              ))
            ) : (
              <option>Cargando tipos de obra...</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="tipoFacturable">
        <Form.Label column sm="2">
          <strong>Facturable:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="facturable"
            value={formObra.facturable}
            onChange={onChangeForm}
          >
            <option value="">Seleccionar...</option>
            {catalogos?.tiposFacturables?.length > 0 ? (
              catalogos.tiposFacturables.map((tipo) => (
                <option key={tipo.id_tipo} value={tipo.id_tipo}>
                  {tipo.descripcion}
                </option>
              ))
            ) : (
              <option>Cargando tipos facturables...</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="estadoObra">
        <Form.Label column sm="2">
          <strong>Estado:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="estadoObra"
            value={formObra.estadoObra}
            onChange={onChangeForm}
          >
            <option value="">Seleccionar...</option>
            {catalogos?.estadosObra?.length > 0 ? (
              catalogos.estadosObra.map((estado) => (
                <option key={estado.codigo_estado} value={estado.codigo_estado}>
                  {estado.descripcion_estado}
                </option>
              ))
            ) : (
              <option>Cargando estados de obra...</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="fAlta">
        <Form.Label column sm="2">
          <strong>Fecha de Alta:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="date"
            name="fechaAlta"
            value={formObra.fechaAlta}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="usuarioAlta">
        <Form.Label column sm="2">
          <strong>Usuario Alta:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="usuarioAlta"
            value={formObra.usuarioAlta}
            onChange={onChangeForm}
          >
            <option value="">Seleccionar...</option>
            {catalogos?.usuarios?.length > 0 ? (
              catalogos.usuarios.map((usuario) => (
                <option
                  key={usuario.codigo_usuario}
                  value={usuario.codigo_usuario}
                >
                  {`(${usuario.codigo_firma}) ${usuario.nombre || ""} ${
                    usuario.apellido1 || ""
                  } ${usuario.apellido2 || ""}`}
                </option>
              ))
            ) : (
              <option>Cargando usuarios...</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="fFin">
        <Form.Label column sm="2">
          <strong>Fecha Prevista:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="date"
            name="fechaFin"
            value={formObra.fechaFin}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <div className="d-flex align-items-center mt-3">
        <Form.Check
          type="checkbox"
          label="Ofertado:"
          checked={ofertado}
          onChange={onChangeOfertado}
          className="me-3"
        />

        {ofertado && (
          <Form.Control
            type="date"
            name="fechaOferta"
            value={formObra.fechaOferta}
            onChange={onChangeForm}
          />
        )}
      </div>

      <Form.Group as={Row} controlId="horasPrevistas">
        <Form.Label column sm="2">
          <strong>Horas Previstas:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="number"
            name="horasPrevistas"
            value={formObra.horasPrevistas}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="gastoPrevisto">
        <Form.Label column sm="2">
          <strong>Gasto Previsto:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="number"
            name="gastoPrevisto"
            value={formObra.gastoPrevisto}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="importe">
        <Form.Label column sm="2">
          <strong>Importe:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="number"
            name="importe"
            value={formObra.importe}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="viabilidad">
        <Form.Label column sm="2">
          <strong>Viabilidad:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="number"
            name="viabilidad"
            value={formObra.viabilidad}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="empresa">
        <Form.Label column sm="2">
          <strong>Empresa:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="empresa"
            value={formObra.empresa}
            onChange={onChangeForm}
          >
            <option value="">Seleccionar...</option>
            {catalogos?.empresas?.length > 0 ? (
              catalogos.empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))
            ) : (
              <option>Cargando empresas...</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="contacto">
        <Form.Label column sm="2">
          <strong>Contacto:</strong>
        </Form.Label>

        <Col sm="10">
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              as="select"
              name="contacto"
              value={formObra.contacto}
              onChange={onChangeForm}
            >
              <option value="">Seleccionar...</option>
              {catalogos?.contactosEmpresa?.length > 0 ? (
                catalogos.contactosEmpresa.map((contacto) => (
                  <option
                    key={contacto.id}
                    value={contacto.id}
                  >
                    {`${contacto.nombre} ${contacto.apellido1} ${contacto.apellido2}`}
                  </option>
                ))
              ) : (
                <option>Cargando contactos...</option>
              )}
            </Form.Control>

            <Button
              onClick={onAgregarContacto}
              variant="outline-primary"
              size="sm"
              type="button"
            >
              Añadir
            </Button>
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="edificio">
        <Form.Label column sm="2">
          <strong>Complejo:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="edificio"
            value={formObra.edificio}
            onChange={onChangeForm}
          >
            <option value="">Seleccionar...</option>
            {catalogos?.edificios?.length > 0 ? (
              catalogos.edificios.map((edificio) => (
                <option key={edificio.id} value={edificio.id}>
                  {edificio.nombre}
                </option>
              ))
            ) : (
              <option>Cargando complejos...</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="observaciones">
        <Form.Label column sm="2">
          <strong>Observaciones:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="observaciones"
            value={formObra.observaciones}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="observacionesInternas">
        <Form.Label column sm="2">
          <strong>Observaciones Internas:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="observacionesInternas"
            value={formObra.observacionesInternas}
            onChange={onChangeForm}
          />
        </Col>
      </Form.Group>
    </fieldset>
  );
};

export default FormInformacionGeneral;
