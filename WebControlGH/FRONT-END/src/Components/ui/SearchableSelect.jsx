import React from "react";
import { Button } from "react-bootstrap";
import SearchDropdown from "./SearchDropdown";

/**
 * Campo de búsqueda con sugerencias desplegables y selección única.
 *
 * Props:
 *  - placeholder, value, onChange, suggestions, onSelect, renderSuggestion, keyField, disabled
 *    → delegadas a SearchDropdown (ver su documentación)
 *  - selected: item seleccionado actualmente (null si ninguno)
 *  - renderSelected: (item) => string|JSX — cómo renderizar el item seleccionado
 *  - onRemove: handler para quitar la selección (sin argumentos)
 *
 * Ejemplo:
 *   <SearchableSelect
 *     placeholder="Buscar producto por referencia..."
 *     value={busquedaProducto}
 *     onChange={onBuscarProducto}
 *     suggestions={sugerenciasProductos}
 *     onSelect={onSeleccionarProducto}
 *     renderSuggestion={(p) => p.descripcion}
 *     selected={productoSeleccionado}
 *     renderSelected={(p) => <><strong>Producto:</strong> {p.descripcion}</>}
 *     onRemove={onEliminarProducto}
 *     disabled={!!editID}
 *   />
 */
const SearchableSelect = ({
  placeholder,
  value,
  onChange,
  suggestions,
  onSelect,
  renderSuggestion,
  keyField = "id",
  selected,
  renderSelected,
  onRemove,
  disabled = false,
}) => {
  return (
    <div className="mb-2 position-relative">
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
      {selected && (
        <div className="mt-2">
          <span>{renderSelected(selected)}</span>
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={onRemove}
            disabled={disabled}
          >
            Quitar
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
