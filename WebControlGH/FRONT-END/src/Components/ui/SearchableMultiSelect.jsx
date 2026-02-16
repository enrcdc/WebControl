import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import SearchDropdown from "./SearchDropdown";

/**
 * Campo de búsqueda con sugerencias desplegables y selección múltiple.
 *
 * Props:
 *  - placeholder, value, onChange, suggestions, onSelect, renderSuggestion, keyField, disabled
 *    → delegadas a SearchDropdown (ver su documentación)
 *  - selectedItems: array de items seleccionados
 *  - renderSelected: (item) => string|JSX — cómo renderizar cada item en la lista
 *  - onRemove: (item) => void — handler para quitar un item (recibe el item completo)
 *
 * Ejemplo:
 *   <SearchableMultiSelect
 *     placeholder="Buscar obra hija..."
 *     value={obraHijaBusqueda}
 *     onChange={onBuscarHija}
 *     suggestions={sugerenciasHijas || []}
 *     onSelect={onAgregarHija}
 *     renderSuggestion={(o) => `${o.codigo_obra} - ${o.descripcion_obra}`}
 *     keyField="id_obra"
 *     selectedItems={obrasHijasSeleccionadas}
 *     renderSelected={(o) => `${o.codigo_obra} - ${o.descripcion_obra}`}
 *     onRemove={(o) => onEliminarHija(o.id_obra)}
 *   />
 */
const SearchableMultiSelect = ({
  placeholder,
  value,
  onChange,
  suggestions,
  onSelect,
  renderSuggestion,
  keyField = "id",
  selectedItems = [],
  renderSelected,
  onRemove,
  disabled = false,
}) => {
  return (
    <div className="position-relative">
      <SearchDropdown
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        suggestions={suggestions}
        onSelect={onSelect}
        renderSuggestion={renderSuggestion}
        keyField={keyField}
        disabled={disabled}
      />
      {selectedItems.length > 0 && (
        <ListGroup className="mt-2">
          {selectedItems.map((item) => (
            <ListGroup.Item
              key={item[keyField]}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{renderSelected(item)}</span>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onRemove(item)}
                disabled={disabled}
              >
                Quitar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchableMultiSelect;
