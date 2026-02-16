// COMPONENTE JSX RELATIVO AL RESUMEN DE LA OBRA

import React from "react";

const ResumenObra = ({ obra, totales }) => {
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
          <strong>H.Previstas:</strong> {obra.horas_previstas || 0}
        </p>
        <p>
          <strong>H. Reales:</strong> {totales.totalHoras?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Gasto Personal (GP):</strong>{" "}
          {totales.totalImporteHoras?.toFixed(2) || 0}
        </p>
        <p>
          <strong>H. Totales:</strong>{" "}
          {((totales.totalHoras || 0) + (totales.totalHorasExtra || 0)).toFixed(
            2
          )}
        </p>
        <p>
          <strong>G.Personal Total (GP + GHE):</strong>{" "}
          {(
            (totales.totalImporteHoras || 0) +
            (totales.totalImporteHorasExtra || 0)
          ).toFixed(2)}
        </p>
        <p>
          <strong>H.Extra:</strong> {totales.totalHorasExtra?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Gasto H.Extra (GHE):</strong>{" "}
          {totales.totalImporteHorasExtra?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Gasto Prev:</strong> {obra.gasto_previsto || 0}
        </p>
        <p>
          <strong>G.Real (GR):</strong>{" "}
          {totales.totalImporteGastos?.toFixed(2) || 0}
        </p>
        <p>
          <strong>G.Almacen (GA):</strong>{" "}
          {totales.totalImporteMovimientosAlmacen?.toFixed(2) || 0}
        </p>
        <p>
          <strong>G.Compras (GC):</strong>{" "}
          {totales.totalImporteCompras?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Importe:</strong> {obra.importe || 0}
        </p>
        <p>
          <strong>Sum P:</strong> {totales.totalImportePedidos?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Sum F:</strong>{" "}
          {totales.totalImporteFacturas?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Pte P:</strong> {totales.porcentajePedido?.toFixed(2) || 0}%
        </p>
        <p>
          <strong>Pte F:</strong> {totales.porcentajeFacturado?.toFixed(2) || 0}
          %
        </p>
        <p>
          <strong>G.Total (GP + GR + GHE + GA + GC):</strong>{" "}
          {totales.gastoTotal?.toFixed(2) || 0}
        </p>
        <p>
          <strong>Rentabilidad:</strong> {totales.rentabilidad?.toFixed(2) || 0}
        </p>
        <p>
          <strong>%Rent:</strong>{" "}
          {totales.porcentajeRentabilidad?.toFixed(2) || 0}%
        </p>
      </div>
    </div>
  );
};

export default ResumenObra;
