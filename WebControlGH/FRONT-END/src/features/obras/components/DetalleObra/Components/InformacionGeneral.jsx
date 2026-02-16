// COMPONENTE JSX RELATIVO A LA INFORMACIÓN GENERAL DE LA OBRA

// components/DetalleObra/components/InformacionGeneral.jsx
import React from "react";
import { Card, Form, Row, Col, Button, ListGroup } from "react-bootstrap";

const InformacionGeneral = ({
  formObra,
  editarObra,
  enSeguimiento,
  obraPadre,
  obrasHijas,
  sugerenciasPadre,
  sugerenciasHijas,
  busquedaPadre,
  busquedaHijas,
  onChangeFormObra,
  onChangeSeguimiento,
  onBuscarObraPadre,
  onSeleccionarObraPadre,
  onEliminarObraPadre,
  onBuscarObraHija,
  onAgregarObraHija,
  onEliminarObraHija,
}) => {
  return (
    <Card className="p-3 mb-3">
      <Form>
        <Form.Group controlId="obraCod">
          <Form.Label>
            <strong>Código de Obra:</strong>
          </Form.Label>
          <Form.Control
            type="text"
            name="cod"
            value={formObra.cod || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          />
        </Form.Group>

        <Form.Group controlId="obraDescripcion" className="mt-2">
          <Form.Label>
            <strong>Descripción:</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            name="desc"
            value={formObra.desc || ""}
            onChange={onChangeFormObra}
            disabled={!editarObra}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="En Seguimiento"
          checked={enSeguimiento}
          onChange={onChangeSeguimiento}
          disabled={!editarObra}
          className="mt-3"
        />

        {enSeguimiento && (
          <>
            <Form.Group as={Row} controlId="fSeg">
              <Form.Label column sm="2">
                <strong>Fecha Seguimiento:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="fechaSeg"
                  value={
                    formObra.fechaSeg
                      ? new Date(formObra.fechaSeg).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={onChangeFormObra}
                  disabled={!editarObra}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="descripcionSeg">
              <Form.Label column sm="2">
                <strong>Motivo:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="descSeg"
                  value={formObra.descSeg || "Sin descripción"}
                  onChange={onChangeFormObra}
                  disabled={!editarObra}
                />
              </Col>
            </Form.Group>
          </>
        )}

        {/* BUSCADOR DE OBRA PADRE Y OBRAS SUBORDINADAS */}
        <Form.Group controlId="relacionObras" className="mt-2">
          <Form.Label>
            <strong>Relación con otras obras:</strong>
          </Form.Label>
          <div>
            {/* Obra Padre */}
            <div className="mb-2 position-relative">
              <strong>Depende de la obra:</strong>
              <Form.Control
                type="text"
                placeholder="Buscar obra padre..."
                value={busquedaPadre}
                onChange={onBuscarObraPadre}
                autoComplete="off"
                disabled={!editarObra}
              />
              {/* Sugerencias obra padre */}
              {sugerenciasPadre.length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{ zIndex: 10 }}
                >
                  {sugerenciasPadre.map((obra) => (
                    <li
                      key={obra.id_obra}
                      className="list-group-item list-group-item-action"
                      onClick={() => onSeleccionarObraPadre(obra)}
                      style={{ cursor: "pointer" }}
                    >
                      {obra.codigo_obra} - {obra.descripcion_obra}
                    </li>
                  ))}
                </ul>
              )}
              {/* Obra padre seleccionada */}
              {obraPadre && (
                <div className="mt-2">
                  <span>
                    <strong>Obra padre seleccionada:</strong>{" "}
                    {obraPadre.codigo_obra} - {obraPadre.descripcion_obra}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={onEliminarObraPadre}
                    disabled={!editarObra}
                  >
                    Quitar
                  </Button>
                </div>
              )}
            </div>

            {/* Obras Hijas */}
            <div className="position-relative">
              <strong>Obras Subordinadas:</strong>
              <Form.Control
                type="text"
                placeholder="Buscar obra hija..."
                value={busquedaHijas}
                onChange={onBuscarObraHija}
                autoComplete="off"
                disabled={!editarObra}
              />
              {/* Sugerencias obras hijas */}
              {sugerenciasHijas.length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{ zIndex: 10 }}
                >
                  {sugerenciasHijas.map((obra) => (
                    <li
                      key={obra.id_obra}
                      className="list-group-item list-group-item-action"
                      onClick={() => onAgregarObraHija(obra)}
                      style={{ cursor: "pointer" }}
                    >
                      {obra.codigo_obra} - {obra.descripcion_obra}
                    </li>
                  ))}
                </ul>
              )}
              {/* Listado de obras hijas seleccionadas */}
              {obrasHijas.length > 0 && (
                <ListGroup className="mt-2">
                  {obrasHijas.map((obra) => (
                    <ListGroup.Item
                      key={obra.id_obra}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {obra.codigo_obra} - {obra.descripcion_obra}
                      </span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onEliminarObraHija(obra.id_obra)}
                        disabled={!editarObra}
                      >
                        Quitar
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </div>
        </Form.Group>
      </Form>
    </Card>
  );
};

export default InformacionGeneral;
