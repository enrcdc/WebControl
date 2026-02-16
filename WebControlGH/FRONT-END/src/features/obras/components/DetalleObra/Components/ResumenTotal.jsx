// COMPONENTE JSX RELATIVO AL RESUMEN TOTAL

import React from "react";

const ResumenTotal = ({ totales }) => {
  return (
    <div className="mt-3">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <p>
          <strong>Importe:</strong> {totales.importeTotal?.toFixed(2) || 0}
        </p>
        <p>
          <strong>G.Total:</strong>{" "}
          {totales.gastoTotalCompleto?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Rentabilidad:</strong>{" "}
          {totales.rentabilidadTotal?.toFixed(2) || 0}
        </p>
        <p>
          <strong>%Rent:</strong>{" "}
          {totales.porcentajeRentabilidadTotal?.toFixed(2) || 0}%
        </p>
      </div>
    </div>
  );
};

export default ResumenTotal;
