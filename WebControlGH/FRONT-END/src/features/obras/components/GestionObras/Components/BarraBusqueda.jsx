// COMPONENTE JSX RELATIVO A LA BARRA DE BUSQUEDA DE OBRAS

import React from "react";
import { Col, InputGroup, FormControl, Button } from "react-bootstrap";

const BarraBusqueda = ({ searchTerm, onSearchTermChange, onSearch }) => {
  return (
    <Col md={8}>
      <InputGroup className="search-bar2">
        <FormControl
          placeholder="Código de obra"
          aria-label="Código de obra"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="custom-input"
        />
        <Button variant="primary" onClick={onSearch} className="custom-button2">
          Buscar
        </Button>
      </InputGroup>
    </Col>
  );
};

export default BarraBusqueda;
