// COMPONENTE JSX RELATIVO A LA INFORMACIÓN DE LOS DESPLEGABLES

import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const CatalogosObra = ({
  formObra,
  catalogos,
  editarObra,
  ofertado,
  onChangeFormObra,
  onChangeOfertado,
}) => {
  return (
    <>
      <Form.Group as={Row} controlId="tipoObra">
        <Form.Label column sm="2">
          <strong>Tipo de Obra:</strong>
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name="tipoObra"
            value={formObra.tipoObra || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.tiposObra.length > 0 ? (
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
            value={formObra.facturable || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.tiposFacturables.length > 0 ? (
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
            value={formObra.estadoObra || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.estadosObra.length > 0 ? (
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
            value={
              formObra.fechaAlta
                ? new Date(formObra.fechaAlta).toISOString().slice(0, 10)
                : ""
            }
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.usuarioAlta || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.usuarios.length > 0 ? (
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
            value={
              formObra.fechaFin
                ? new Date(formObra.fechaFin).toISOString().slice(0, 10)
                : ""
            }
            onChange={onChangeFormObra}
            disabled={!editarObra}
          />
        </Col>
      </Form.Group>

      <div className="d-flex align-items-center mt-3">
        <Form.Check
          type="checkbox"
          label="Ofertado:"
          checked={ofertado}
          onChange={onChangeOfertado}
          disabled={!editarObra}
          className="me-3"
        />

        {ofertado && (
          <Form.Control
            type="date"
            name="fechaOferta"
            value={
              formObra.fechaOferta
                ? new Date(formObra.fechaOferta).toISOString().slice(0, 10)
                : ""
            }
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.horasPrevistas || 0}
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.gastoPrevisto || 0}
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.importe || 0}
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.viabilidad || 0}
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.empresa || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.empresas.length > 0 ? (
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
          <Form.Control
            as="select"
            name="contacto"
            value={formObra.contacto || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.contactosEmpresa.length > 0 ? (
              catalogos.contactosEmpresa.map((contacto) => (
                <option key={contacto.id} value={contacto.id}>
                  {`${contacto.nombre} ${contacto.apellido1} ${contacto.apellido2}`}
                </option>
              ))
            ) : (
              <option>Cargando contactos...</option>
            )}
          </Form.Control>
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
            value={formObra.edificio || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          >
            {catalogos.edificios.length > 0 ? (
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
            value={formObra.observaciones || "Sin observaciones"}
            onChange={onChangeFormObra}
            disabled={!editarObra}
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
            value={formObra.observacionesInternas || "Sin observaciones"}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          />
        </Col>
      </Form.Group>
    </>
  );
};

export default CatalogosObra;
