import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { pedidoService } from "../services/pedido.service";

function ImprimirPedidos() {
  // Estado para los detalles que se van a imprimir
  const [pedidosDetalles, setPedidosDetalles] = useState([]);
  // Estado para mostrar un mensaje de carga mientras se traen los pedidos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar un mensaje de error en la carga de pedidos
  const [error, setError] = useState(null);

  // Objeto location. Accederemos a la propiedad state para sacar los pedidos a imprimir
  const location = useLocation();
  const selectedPedidos = location.state.selectedPedidos;

  // Fetch de los pedidos a imprimir
  const fetchPedidos = async () => {
    try {
      const pedidoPromises = Array.from(selectedPedidos).map(async (id) => {
        const response = await pedidoService.getById(id);
        return { id: id, detalles: response.data?.data || response.data };
      });
      const pedidos = await Promise.all(pedidoPromises);
      setPedidosDetalles(pedidos);
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${
            error.response.data.error ||
            "Error al cargar los detalles de los pedidos."
          }`,
        );
      } else if (error.request) {
        setError("Error en la solicitud al servidor.");
      } else {
        setError("Error desconocido al cargar los detalles de los pedidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  // UseEffect para cargar los pedidos a imprimir cuando se monte el componente por primera vez
  useEffect(() => {
    fetchPedidos();
  }, [selectedPedidos]);

  if (loading) {
    return <div>Cargando detalles de las facturas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  };

  const headerStyle = {
    ...cellStyle,
    backgroundColor: "lightblue",
  };

  return (
    <div>
      <h2 style={{ fontSize: "18px ", textAlign: "right" }}>
        Pedidos ControlCube
      </h2>
      {pedidosDetalles.map(({ id, detalles }) => (
        <div key={id}>
          <h3 style={{ fontSize: "14px" }}>Detalles del Pedido: {id}</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Obra</th>
                <th style={headerStyle}>Cliente</th>
                <th style={headerStyle}>Proveedor</th>
                <th style={headerStyle}>Fecha</th>
                <th style={headerStyle}>Estado</th>
                <th style={headerStyle}>Importe</th>
                <th style={headerStyle}>Concepto</th>
                <th style={headerStyle}>Referencia</th>
                <th style={headerStyle}>Obs.</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(detalles) && detalles.length > 0 ? (
                detalles.map((detalle) => (
                  <tr key={detalle.id}>
                    <td style={cellStyle}>{detalle.obra}</td>
                    <td style={cellStyle}>{detalle.cliente}</td>
                    <td style={cellStyle}>{detalle.proveedor}</td>
                    <td style={cellStyle}>{detalle.fecha}</td>
                    <td style={cellStyle}>{detalle.estado}</td>
                    <td style={cellStyle}>{detalle.importe} €</td>
                    <td style={cellStyle}>{detalle.concepto}</td>
                    <td style={cellStyle}>{detalle.referencia}</td>
                    <td style={cellStyle}>{detalle.observaciones}</td>
                  </tr>
                ))
              ) : detalles && !Array.isArray(detalles) ? (
                <tr>
                  <td style={cellStyle}>{detalles.obra}</td>
                  <td style={cellStyle}>{detalles.cliente}</td>
                  <td style={cellStyle}>{detalles.proveedor}</td>
                  <td style={cellStyle}>{detalles.fecha}</td>
                  <td style={cellStyle}>{detalles.estado}</td>
                  <td style={cellStyle}>{detalles.importe} €</td>
                  <td style={cellStyle}>{detalles.concepto}</td>
                  <td style={cellStyle}>{detalles.referencia}</td>
                  <td style={cellStyle}>{detalles.observaciones}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="9" style={cellStyle}>
                    No hay detalles disponibles para este pedido.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ImprimirPedidos;
