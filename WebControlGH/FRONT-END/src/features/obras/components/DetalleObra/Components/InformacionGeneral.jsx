// COMPONENTE JSX RELATIVO A LA INFORMACIÓN GENERAL DE LA OBRA

// components/DetalleObra/components/InformacionGeneral.jsx
import React from "react";
import { Card, Form, Row, Col, Button, ListGroup } from "react-bootstrap";

import {
  SearchableSelect,
  SearchableMultiSelect,
} from "../../../../../Components/ui";

const renderObra = (obra) => `${obra.codigo_obra} - ${obra.descripcion_obra}`;

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
            Depende de la obra:
            {/* Obra Padre — selección única */}
            <SearchableSelect
              placeholder={"Buscar obra padre..."}
              value={busquedaPadre}
              onChange={onBuscarObraPadre}
              suggestions={sugerenciasPadre || []}
              onSelect={onSeleccionarObraPadre}
              renderSuggestion={renderObra}
              keyField="id_obra"
              selected={obraPadre}
              renderSelected={(o) => (
                <>Obra padre seleccionada: {renderObra(o)}</>
              )}
              onRemove={onEliminarObraPadre}
            />
            {/* Obras Hijas — selección múltiple */}
            Obras Subordinadas:
            <SearchableMultiSelect
              placeholder={"Buscar obra hija..."}
              value={busquedaHijas}
              onChange={onBuscarObraHija}
              suggestions={sugerenciasHijas || []}
              onSelect={onAgregarObraHija}
              renderSuggestion={renderObra}
              keyField="id_obra"
              selectedItems={obrasHijas || []}
              renderSelected={renderObra}
              onRemove={(obra) => onEliminarObraHija(obra.id_obra)}
            />
          </div>
        </Form.Group>
      </Form>
    </Card>
  );
};

export default InformacionGeneral;
