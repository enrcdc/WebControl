import React from "react";
import { Form } from "react-bootstrap";

/**
 * Sub-componente interno: input de búsqueda con dropdown de sugerencias.
 * Compartido por SearchableSelect y SearchableMultiSelect.
 * No usar directamente — importar SearchableSelect o SearchableMultiSelect.
 */
const SearchDropdown = ({
  placeholder = "Buscar...",
  value,
  onChange,
  suggestions = [],
  onSelect,
  renderSuggestion,
  keyField = "id",
  disabled = false,
}) => {
  return (
    <>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        disabled={disabled}
      />
      {suggestions.length > 0 && (
        <ul
          className="list-group position-absolute w-100"
          style={{ zIndex: 10 }}
        >
          {suggestions.map((item) => (
            <li
              key={item[keyField]}
              className="list-group-item list-group-item-action"
              onClick={() => onSelect(item)}
              style={{ cursor: "pointer" }}
            >
              {renderSuggestion(item)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchDropdown;
