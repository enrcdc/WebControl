// COMPONENTE JSX RELATIVO AL RESUMEN DE OBRAS SUBORDINADAS

import React from "react";

const ResumenSubordinadas = ({ totales }) => {
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
          <strong>H.Previstas:</strong>{" "}
          {totales.totalHorasPrevistasSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>H.Reales:</strong> {totales.totalHorasSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>G.Personal:</strong>{" "}
          {totales.totalImporteHorasSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>H.Totales:</strong>{" "}
          {(
            (totales.totalHorasSub || 0) + (totales.totalHorasExtraSub || 0)
          ).toFixed(2)}
        </p>
        <p>
          <strong>G.Personal Total (GP + GHE):</strong>{" "}
          {(
            (totales.totalImporteHorasSub || 0) +
            (totales.totalImporteHorasExtraSub || 0)
          ).toFixed(2)}
        </p>
        <p>
          <strong>H.Extra:</strong>{" "}
          {totales.totalHorasExtraSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Gasto H.Extra:</strong>{" "}
          {totales.totalImporteHorasExtraSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Gasto Prev:</strong>{" "}
          {totales.totalGastosPrevistosSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>G.Real:</strong>{" "}
          {totales.totalImporteGastosSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>G.Almacen:</strong> Sin incluir
        </p>
        <p>
          <strong>G.Compras:</strong> Sin incluir
        </p>
        <p>
          <strong>Importe:</strong>{" "}
          {totales.totalImporteObrasSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Sum P:</strong>{" "}
          {totales.totalImportePedidosSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Sum F:</strong>{" "}
          {totales.totalImporteFacturasSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Pte P:</strong>{" "}
          {(
            (totales.totalImporteObrasSub || 0) -
            (totales.totalImportePedidosSub || 0)
          ).toFixed(2)}
        </p>
        <p>
          <strong>Pte F:</strong>{" "}
          {(
            (totales.totalImporteObrasSub || 0) -
            (totales.totalImporteFacturasSub || 0)
          ).toFixed(2)}
        </p>
        <p>
          <strong>G.Total (GP + GR + GHE + GA + GC):</strong>{" "}
          {totales.gastoTotalSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Rentabilidad:</strong>{" "}
          {totales.rentabilidadSub?.toFixed(2) || 0}
        </p>
        <p>
          <strong>%Rent:</strong>{" "}
          {totales.porcentajeRentabilidadSub?.toFixed(2) || 0}%
        </p>
      </div>
    </div>
  );
};

export default ResumenSubordinadas;
