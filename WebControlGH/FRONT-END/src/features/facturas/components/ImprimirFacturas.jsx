import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { facturaService } from "../services/factura.service";
import { formatearFechaLocal } from "utils/fechasHelper";

function ImprimirFacturas() {
  const [facturasDetalles, setFacturasDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const selectedFacturas = location.state?.selectedFacturas ?? [];

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const detallesPromises = selectedFacturas.map(async (id) => {
          const response = await facturaService.getById(id);
          return response.data?.data || response.data;
        });
        setFacturasDetalles(await Promise.all(detallesPromises));
      } catch {
        setError("Error al cargar los detalles de las facturas.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Cargando detalles de las facturas...</div>;
  if (error) return <div>{error}</div>;

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  };

  const headerStyle = { ...cellStyle, backgroundColor: "lightblue" };

  return (
    <div>
      <h2 style={{ fontSize: "18px", textAlign: "right" }}>
        Facturas ControlCube
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "10px",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Código Factura</th>
            <th style={headerStyle}>Pedido</th>
            <th style={headerStyle}>Obra</th>
            <th style={headerStyle}>Concepto Factura</th>
            <th style={headerStyle}>Concepto Línea</th>
            <th style={headerStyle}>Importe</th>
            <th style={headerStyle}>Fecha</th>
            <th style={headerStyle}>Observaciones</th>
            <th style={headerStyle}>Cobrado</th>
          </tr>
        </thead>
        <tbody>
          {facturasDetalles.length === 0 ? (
            <tr>
              <td colSpan="9" style={cellStyle}>
                No hay detalles disponibles.
              </td>
            </tr>
          ) : (
            facturasDetalles.map((f) => (
              <tr key={f.id_factura}>
                <td style={cellStyle}>{f.codigo_factura ?? "—"}</td>
                <td style={cellStyle}>{f.codigo_pedido ?? "—"}</td>
                <td style={cellStyle}>
                  {f.codigo_obra
                    ? `${f.codigo_obra} — ${f.descripcion_obra}`
                    : "—"}
                </td>
                <td style={cellStyle}>{f.concepto_factura ?? "—"}</td>
                <td style={cellStyle}>{f.concepto_linea ?? "—"}</td>
                <td style={cellStyle}>
                  {f.importe != null ? `${f.importe} €` : "—"}
                </td>
                <td style={cellStyle}>
                  {f.fecha ? formatearFechaLocal(f.fecha) : "—"}
                </td>
                <td style={cellStyle}>{f.observaciones ?? "—"}</td>
                <td
                  style={{
                    ...cellStyle,
                    color: f.fecha_cobro ? "green" : "red",
                  }}
                >
                  {f.fecha_cobro ? "Sí" : "No"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ImprimirFacturas;
