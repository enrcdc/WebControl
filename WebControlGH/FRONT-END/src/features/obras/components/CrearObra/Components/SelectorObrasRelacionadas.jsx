// Componente presentacional para seleccionar obras relacionadas (padre e hijas)
import React from "react";
import { Form, Button, ListGroup } from "react-bootstrap";

const SelectorObrasRelacionadas = ({
  // Obra padre
  obraPadreBusqueda,
  sugerenciasPadre,
  obraPadreSeleccionada,
  onBuscarPadre,
  onSeleccionarPadre,
  onEliminarPadre,
  // Obras hijas
  obraHijaBusqueda,
  sugerenciasHijas,
  obrasHijasSeleccionadas,
  onBuscarHija,
  onAgregarHija,
  onEliminarHija,
}) => {
  return (
    <Form.Group controlId="relacionObras" className="mt-2">
      <Form.Label>
        <strong>Relación con otras obras:</strong>
      </Form.Label>
      <div>
        {/* Obra Padre */}
        <div className="mb-2 position-relative">
          Depende de la obra:
          <Form.Control
            type="text"
            placeholder="Buscar obra padre..."
            value={obraPadreBusqueda}
            onChange={onBuscarPadre}
            autoComplete="off"
          />
          {/* Sugerencias obra padre */}
          {sugerenciasPadre && sugerenciasPadre.length > 0 && (
            <ul
              className="list-group position-absolute w-100"
              style={{ zIndex: 10 }}
            >
              {sugerenciasPadre.map((obra) => (
                <li
                  key={obra.id_obra}
                  className="list-group-item list-group-item-action"
                  onClick={() => onSeleccionarPadre(obra)}
                  style={{ cursor: "pointer" }}
                >
                  {obra.codigo_obra} - {obra.descripcion_obra}
                </li>
              ))}
            </ul>
          )}
          {/* Obra padre seleccionada */}
          {obraPadreSeleccionada && (
            <div className="mt-2">
              <span>
                Obra padre seleccionada: {obraPadreSeleccionada.codigo_obra} -{" "}
                {obraPadreSeleccionada.descripcion_obra}
              </span>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={onEliminarPadre}
              >
                Quitar
              </Button>
            </div>
          )}
        </div>

        {/* Obras Hijas */}
        <div className="position-relative">
          Obras Subordinadas:
          <Form.Control
            type="text"
            placeholder="Buscar obra hija..."
            value={obraHijaBusqueda}
            onChange={onBuscarHija}
            autoComplete="off"
          />
          {/* Sugerencias obras hijas */}
          {sugerenciasHijas && sugerenciasHijas.length > 0 && (
            <ul
              className="list-group position-absolute w-100"
              style={{ zIndex: 10 }}
            >
              {sugerenciasHijas.map((obra) => (
                <li
                  key={obra.id_obra}
                  className="list-group-item list-group-item-action"
                  onClick={() => onAgregarHija(obra)}
                  style={{ cursor: "pointer" }}
                >
                  {obra.codigo_obra} - {obra.descripcion_obra}
                </li>
              ))}
            </ul>
          )}
          {/* Listado de obras hijas seleccionadas */}
          {obrasHijasSeleccionadas && obrasHijasSeleccionadas.length > 0 && (
            <ListGroup className="mt-2">
              {obrasHijasSeleccionadas.map((obra) => (
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
                    onClick={() => onEliminarHija(obra.id_obra)}
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
  );
};

export default SelectorObrasRelacionadas;
