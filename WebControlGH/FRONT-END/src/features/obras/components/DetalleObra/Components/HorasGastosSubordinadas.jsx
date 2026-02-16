// COMPONENTE JSX RELATIVO A LAS HORAS/GASTOS DE LAS OBRAS SUBORDINADAS

import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { formatearFechaLocal } from "../../../../../utils/fechasHelper.js";

const HorasGastosSubordinadas = ({
  horasHijas,
  horasExtraHijas,
  gastosHijas,
  tiposGastosHijas,
  totales,
}) => {
  const [mostrarHorasHijas, setMostrarHorasHijas] = useState(false);
  const [mostrarGastosHijas, setMostrarGastosHijas] = useState(false);

  return (
    <>
      <h5>Horas Imputadas a Obras Subordinadas</h5>
      <Form.Check
        type="checkbox"
        label="Mostrar listado de horas de las Obras Subordinadas"
        className="mb-3"
        checked={mostrarHorasHijas}
        onChange={() => setMostrarHorasHijas((prev) => !prev)}
      />

      {mostrarHorasHijas && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Dia Trab.</th>
              <th>Usu</th>
              <th>Tarea</th>
              <th>hrs.</th>
              <th>p.h.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {horasHijas.length > 0 ? (
              horasHijas.map((hora, idx) => (
                <tr key={idx}>
                  <td>{formatearFechaLocal(hora.dia_trabajado)}</td>
                  <td>{hora.usuario}</td>
                  <td>{hora.id_tarea}</td>
                  <td>{hora.num_horas}</td>
                  <td>{hora.precio_hora}</td>
                  <td>{(hora.num_horas * hora.precio_hora).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No hay horas asociadas a las obras subordinadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <strong>Totales Horas</strong>
        <p>
          Total Cantidad Horas Obras Subordinadas:{" "}
          {totales.horasSub?.toFixed(2) || 0}
        </p>
        <p>
          Total Importe Horas Obras Subordinadas:{" "}
          {totales.importeHorasSub?.toFixed(2) || 0}
        </p>
      </div>

      <h5 className="mt-4">Horas Extras de Obras Subordinadas</h5>
      {mostrarHorasHijas && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Dia Trab.</th>
              <th>Usu</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>i.u.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {horasExtraHijas.length > 0 ? (
              horasExtraHijas.map((hora, idx) => (
                <tr key={idx}>
                  <td>{formatearFechaLocal(hora.fecha_gasto)}</td>
                  <td>{hora.usuario}</td>
                  <td>{hora.descripcion}</td>
                  <td>{hora.cantidad}</td>
                  <td>{hora.importe}</td>
                  <td>{(hora.cantidad * hora.importe).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No hay horas extras asociadas a las obras subordinadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <strong>Totales Horas Extras</strong>
        <p>
          Total Cantidad Horas Extra: {totales.horasExtraSub?.toFixed(2) || 0}
        </p>
        <p>
          Total Importe Horas Extra:{" "}
          {totales.importeHorasExtraSub?.toFixed(2) || 0}
        </p>
      </div>

      <h5 className="mt-4">Gastos de las Obras Subordinadas</h5>
      <Form.Check
        type="checkbox"
        label="Mostrar listado de gastos de las Obras Subordinadas"
        className="mb-3"
        checked={mostrarGastosHijas}
        onChange={() => setMostrarGastosHijas((prev) => !prev)}
      />

      {mostrarGastosHijas && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>F. Gasto</th>
              <th>Usu</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>Importe Uni.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {gastosHijas.length > 0 ? (
              gastosHijas.map((gasto, idx) => (
                <tr key={idx}>
                  <td>{formatearFechaLocal(gasto.fecha_gasto)}</td>
                  <td>{gasto.usuario_alta}</td>
                  <td>{gasto.tipo_gasto}</td>
                  <td>{gasto.cantidad}</td>
                  <td>{gasto.importe}</td>
                  <td>{(gasto.importe * gasto.cantidad).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No hay gastos asociados a las obras subordinadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <strong>Totales Gastos Generales</strong>
        {tiposGastosHijas.length > 0 ? (
          tiposGastosHijas.map((gasto, idx) => (
            <p key={idx}>{`${gasto.tipo}: ${gasto.importe.toFixed(2)}`}</p>
          ))
        ) : (
          <p>No hay gastos asociados</p>
        )}
        <p>
          <strong>Total Importe Gastos:</strong>{" "}
          {totales.gastoTotalSub?.toFixed(2) || 0}
        </p>
      </div>
    </>
  );
};

export default HorasGastosSubordinadas;
