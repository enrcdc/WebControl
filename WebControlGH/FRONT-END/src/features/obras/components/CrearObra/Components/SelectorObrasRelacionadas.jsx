// Componente presentacional para seleccionar obras relacionadas (padre e hijas)
import React from "react";
import { Form } from "react-bootstrap";
import { SearchableSelect, SearchableMultiSelect } from "../../../../../Components/ui";

const renderObra = (obra) => `${obra.codigo_obra} - ${obra.descripcion_obra}`;

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
        {/* Obra Padre — selección única */}
        Depende de la obra:
        <SearchableSelect
          placeholder="Buscar obra padre..."
          value={obraPadreBusqueda}
          onChange={onBuscarPadre}
          suggestions={sugerenciasPadre || []}
          onSelect={onSeleccionarPadre}
          renderSuggestion={renderObra}
          keyField="id_obra"
          selected={obraPadreSeleccionada}
          renderSelected={(o) => <>Obra padre seleccionada: {renderObra(o)}</>}
          onRemove={onEliminarPadre}
        />

        {/* Obras Hijas — selección múltiple */}
        Obras Subordinadas:
        <SearchableMultiSelect
          placeholder="Buscar obra hija..."
          value={obraHijaBusqueda}
          onChange={onBuscarHija}
          suggestions={sugerenciasHijas || []}
          onSelect={onAgregarHija}
          renderSuggestion={renderObra}
          keyField="id_obra"
          selectedItems={obrasHijasSeleccionadas || []}
          renderSelected={renderObra}
          onRemove={(obra) => onEliminarHija(obra)}
        />
      </div>
    </Form.Group>
  );
};

export default SelectorObrasRelacionadas;
