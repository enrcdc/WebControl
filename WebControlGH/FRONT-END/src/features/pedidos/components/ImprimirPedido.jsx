import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { pedidoService } from "../services/pedido.service";
import { formatearFechaLocal } from "utils/fechasHelper";

function ImprimirPedidos() {
  const [pedidosDetalles, setPedidosDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const selectedPedidos = location.state?.selectedPedidos ?? [];

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidoPromises = selectedPedidos.map(async (id) => {
          const response = await pedidoService.getById(id);
          return response.data?.data || response.data;
        });
        setPedidosDetalles(await Promise.all(pedidoPromises));
      } catch {
        setError("Error al cargar los detalles de los pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Cargando detalles de los pedidos...</div>;
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
        Pedidos ControlCube
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
            <th style={headerStyle}>Código Pedido</th>
            <th style={headerStyle}>Obra</th>
            <th style={headerStyle}>Posición</th>
            <th style={headerStyle}>Fecha</th>
            <th style={headerStyle}>Importe</th>
            <th style={headerStyle}>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosDetalles.length === 0 ? (
            <tr>
              <td colSpan="6" style={cellStyle}>
                No hay detalles disponibles.
              </td>
            </tr>
          ) : (
            pedidosDetalles.map((p) => (
              <tr key={p.id_pedido}>
                <td style={cellStyle}>{p.codigo_pedido ?? "—"}</td>
                <td style={cellStyle}>
                  {p.codigo_obra
                    ? `${p.codigo_obra} — ${p.descripcion_obra}`
                    : "—"}
                </td>
                <td style={cellStyle}>{p.posicion ?? "—"}</td>
                <td style={cellStyle}>
                  {p.fecha ? formatearFechaLocal(p.fecha) : "—"}
                </td>
                <td style={cellStyle}>
                  {p.importe != null ? `${p.importe} €` : "—"}
                </td>
                <td style={cellStyle}>{p.observaciones ?? "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ImprimirPedidos;
