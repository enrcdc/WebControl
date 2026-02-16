// COMPONENTE JSX RELATIVO A LA BARRA DE ACCIONES DE OBRAS

import React from "react";
import { Col, Button } from "react-bootstrap";

const BarraAcciones = ({ onAgregar, onBaja, onCopiar, onImprimir }) => {
  return (
    <Col md={4} className="text-end">
      <Button onClick={onAgregar} className="custom-button">
        Agregar Obra
      </Button>
      <Button onClick={onBaja} className="custom-button">
        Baja Obras
      </Button>
      <Button onClick={onCopiar} className="custom-button">
        Copiar Obras
      </Button>
      <Button onClick={onImprimir} className="custom-button">
        Imprimir Obras
      </Button>
    </Col>
  );
};

export default BarraAcciones;
