import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { facturaService } from "../services/factura.service";

function ImprimirFacturas() {
  const [facturasDetalles, setFacturasDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const selectedFacturas = location.state.selectedFacturas;

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const detallesPromises = Array.from(selectedFacturas).map(
          async (id) => {
            const response = await facturaService.getById(id);
            return { id: id, detalles: response.data?.data || response.data };
          },
        );
        const detalles = await Promise.all(detallesPromises);
        setFacturasDetalles(detalles);
      } catch (error) {
        if (error.response) {
          setError(
            `Error: ${error.response.status} - ${
              error.response.data.error ||
              "Error al cargar los detalles de las facturas."
            }`,
          );
        } else if (error.request) {
          setError("Error en la solicitud al servidor.");
        } else {
          setError(
            "Error desconocido al cargar los detalles de las facturas.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [selectedFacturas]);

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
      <h2 style={{ fontSize: "18px ", textAlign: "right", color: "white" }}>
        Facturas ControlCube
      </h2>
      {facturasDetalles.map(({ id, detalles }) => (
        <div key={id}>
          <h3 style={{ fontSize: "14px", color: "white" }}>
            Detalles de la Factura: {id}
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Origen</th>
                <th style={headerStyle}>Pedido</th>
                <th style={headerStyle}>Obra</th>
                <th style={headerStyle}>Cpto. F</th>
                <th style={headerStyle}>Cpto. L</th>
                <th style={headerStyle}>Impte. Base</th>
                <th style={headerStyle}>IVA (%)</th>
                <th style={headerStyle}>Impte. Iva</th>
                <th style={headerStyle}>Impte. Total</th>
                <th style={headerStyle}>Obs.</th>
                <th style={headerStyle}>Cobrado</th>
              </tr>
            </thead>
            <tbody>
              {detalles ? (
                (() => {
                  const importeBase = Number(
                    detalles.importe_base || detalles.importe || 0,
                  );
                  const iva = Number(detalles.iva || 0);
                  const importeIva = (importeBase * iva) / 100;
                  const importeTotal = Number(detalles.importe || 0);

                  return (
                    <tr key={id}>
                      <td style={cellStyle}>
                        {detalles.codigo_obra || "-"}
                      </td>
                      <td style={cellStyle}>
                        {detalles.pedido_pos || "-"}
                      </td>
                      <td style={cellStyle}>{detalles.obra || "-"}</td>
                      <td style={cellStyle}>
                        {detalles.concepto_f || "-"}
                      </td>
                      <td style={cellStyle}>
                        {detalles.concepto_l || "-"}
                      </td>
                      <td style={cellStyle}>
                        {importeBase.toFixed(2)} €
                      </td>
                      <td style={cellStyle}>{iva}</td>
                      <td style={cellStyle}>
                        {importeIva.toFixed(2)} €
                      </td>
                      <td style={cellStyle}>
                        {importeTotal.toFixed(2)} €
                      </td>
                      <td style={cellStyle}>
                        {detalles.obs_imp || detalles.observaciones || "-"}
                      </td>
                      <td
                        style={{
                          ...cellStyle,
                          color: detalles.cobrado ? "green" : "red",
                        }}
                      >
                        {detalles.cobrado ? "Sí" : "No"}
                      </td>
                    </tr>
                  );
                })()
              ) : (
                <tr>
                  <td colSpan="11" style={cellStyle}>
                    No hay detalles disponibles para esta factura.
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

export default ImprimirFacturas;
