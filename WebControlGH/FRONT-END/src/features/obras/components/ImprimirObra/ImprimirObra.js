import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../../css/ImprimirObra.css";

import { obraService } from "../../services/obra.service.js";

function ImprimirObras() {
  //#region ESTADOS
  const [obrasDetalles, setObrasDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //#endregion

  //#region USE LOCATION
  const location = useLocation();
  const selectedObras = location.state.selectedObras;
  //#endregion

  //#region FETCH DE DATOS
  const fetchDetallesObra = async () => {
    try {
      const detallesPromises = Array.from(selectedObras).map(async (id) => {
        const response = await obraService.getById(id);
        return { id: id, detalles: response.data.data };
      });
      const detalles = await Promise.all(detallesPromises);
      setObrasDetalles(detalles);
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${
            error.response.data.error ||
            "Error al cargar los detalles de las obras."
          }`
        );
      } else if (error.request) {
        setError("Error en la solicitud al servidor.");
      } else {
        setError("Error desconocido al cargar los detalles de las obras");
      }
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  //#region USE EFFECT

  useEffect(() => {
    fetchDetallesObra();
  }, [selectedObras]);

  //#endregion

  //#region JSX
  return (
    <div className="imprimir-obras-container">
      <h2 className="imprimir-obras-title">Obras ControlCube</h2>
      {obrasDetalles.map(({ id, detalles }) => (
        <div key={id} className="obra-section">
          <h3 className="obra-section-title">Detalles de la obra: {id}</h3>
          <table className="obra-table">
            <thead>
              <tr>
                <th>Cód.</th>
                <th>Desc.</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Empresa</th>
                <th>F.Oferta</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length > 0 ? (
                detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.codigo_obra}</td>
                    <td className="descripcion">{detalle.descripcion_obra}</td>
                    <td>{detalle.desc_tipo_obra}</td>
                    <td>{detalle.desc_estado_obra}</td>
                    <td>{detalle.nombre_empresa}</td>
                    <td>
                      {new Date(detalle.fecha_oferta).toLocaleDateString(
                        "es-Es"
                      )}
                    </td>
                    <td className="importe">{detalle.importe} €</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay detalles disponibles para esta obra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
  //#endregion
}

export default ImprimirObras;
