// COMPONENTE JSX RELATIVO A LAS HORAS/GASTOS DE LA OBRA

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { formatearFechaLocal } from "../../../utils/fechas";

const HorasGastos = ({
  horas,
  horasExtra,
  gastos,
  movimientosAlmacen,
  facturasCompras,
  tiposGastos,
  rentabilidad,
  editarObra,
  totales,
  onAgregarGastoAlmacen,
  onEditarGastoAlmacen,
  onEliminarGastoAlmacen,
  onAgregarCompra,
  onEditarCompra,
  onEliminarCompra,
}) => {
  const [mostrarHoras, setMostrarHoras] = useState(false);
  const [mostrarGastos, setMostrarGastos] = useState(false);

  return (
    <>
      {/* HORAS IMPUTADAS */}
      <h5>Horas Imputadas a la Obra</h5>
      <p>
        <strong>Fecha Hora Inicial:</strong>{" "}
        {rentabilidad?.fechaHoraInicial
          ? formatearFechaLocal(rentabilidad.fechaHoraInicial)
          : "Sin especificar"}
      </p>
      <p>
        <strong>Fecha Hora Final:</strong>{" "}
        {rentabilidad?.fechaHoraFinal
          ? formatearFechaLocal(rentabilidad.fechaHoraFinal)
          : "Sin especificar"}
      </p>

      <Form.Check
        type="checkbox"
        label="Mostrar listado de horas"
        className="mb-3"
        checked={mostrarHoras}
        onChange={() => setMostrarHoras((prev) => !prev)}
      />

      {mostrarHoras && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Dia Trab.</th>
              <th>Usu</th>
              <th>Tarea</th>
              <th>Validado</th>
              <th>UsuV</th>
              <th>hrs.</th>
              <th>p.h.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {horas.length > 0 ? (
              horas.map((hora, idx) => (
                <tr key={idx}>
                  <td>{formatearFechaLocal(hora.dia_trabajado)}</td>
                  <td>{hora.usuario}</td>
                  <td>{hora.id_tarea}</td>
                  <td>
                    {hora.fecha_validacion
                      ? formatearFechaLocal(hora.fecha_validacion)
                      : "[NO]"}
                  </td>
                  <td>{hora.usuario_validacion || "-"}</td>
                  <td>{hora.num_horas}</td>
                  <td>{hora.precio_hora}</td>
                  <td>{(hora.num_horas * hora.precio_hora).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay horas asociadas</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <strong>Totales Horas</strong>
        <p>Total Horas Imputadas: {totales.horas?.toFixed(2) || 0}</p>
        <p>Total Importe Horas: {totales.importeHoras?.toFixed(2) || 0}</p>
      </div>

      {/* HORAS EXTRAS */}
      <h5 className="mt-4">Horas Extras de la Obra</h5>
      {mostrarHoras && (
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
            {horasExtra.length > 0 ? (
              horasExtra.map((hora, idx) => (
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
                <td colSpan="6">No hay horas extra asociadas</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <strong>Totales Horas Extras</strong>
        <p>Total Cantidad Horas Extra: {totales.horasExtra?.toFixed(2) || 0}</p>
        <p>
          Total Importe Horas Extra:{" "}
          {totales.importeHorasExtra?.toFixed(2) || 0}
        </p>
      </div>

      {/* GASTOS GENERALES */}
      <h5 className="mt-4">Gastos Generales</h5>
      <Form.Check
        type="checkbox"
        label="Mostrar listado de gastos"
        className="mb-3"
        checked={mostrarGastos}
        onChange={() => setMostrarGastos((prev) => !prev)}
      />

      {mostrarGastos && (
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
            {gastos.length > 0 ? (
              gastos.map((gasto, idx) => (
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
                <td colSpan="6">No hay gastos asociados</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <strong>Totales Gastos Generales</strong>
        {tiposGastos.length > 0 ? (
          tiposGastos.map((gasto, idx) => (
            <p key={idx}>{`${gasto.tipo}: ${gasto.importe.toFixed(2)}`}</p>
          ))
        ) : (
          <p>No hay gastos asociados</p>
        )}
        <p>
          <strong>Total Importe Gastos:</strong>{" "}
          {totales.importeGastos?.toFixed(2) || 0}
        </p>
      </div>

      {/* GASTOS DE ALMACÉN */}
      <h5 className="mt-4">Gastos de Almacén</h5>
      {mostrarGastos && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>CodRef.</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Cant.</th>
              <th>i.u.</th>
              <th>Total</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {movimientosAlmacen.length > 0 ? (
              movimientosAlmacen.map((gasto, idx) => (
                <tr key={idx}>
                  <td>{gasto.codigo_referencia}</td>
                  <td>{gasto.descripcion_referencia}</td>
                  <td>{formatearFechaLocal(gasto.fecha_alta)}</td>
                  <td>{gasto.cantidad}</td>
                  <td>{gasto.importe}</td>
                  <td>{(gasto.importe * gasto.cantidad).toFixed(2)}</td>
                  <td>
                    <p>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => onEditarGastoAlmacen(gasto)}
                      >
                        Detalle
                      </Button>
                    </p>

                    <p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onEliminarGastoAlmacen(gasto.id)}
                        disabled={!editarObra}
                      >
                        Eliminar
                      </Button>
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay gastos de almacén asociados</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <p>
        <Button
          variant="info"
          size="sm"
          onClick={onAgregarGastoAlmacen}
          className="me-2"
          disabled={!editarObra}
        >
          Nuevo Gasto
        </Button>
      </p>

      <div className="mt-3">
        <strong>Totales Almacén</strong>
        <p>Total Importe Almacén: {totales.importeAlmacen?.toFixed(2) || 0}</p>
      </div>

      {/* GASTOS DE COMPRAS */}
      <h5 className="mt-4">Gastos de Compras</h5>
      {mostrarGastos && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Importe</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {facturasCompras.length > 0 ? (
              facturasCompras.map((compra, idx) => (
                <tr key={idx}>
                  <td>{`${compra.Numero} - ${compra.Concepto}`}</td>
                  <td>{formatearFechaLocal(compra.fecha_alta)}</td>
                  <td>{compra.importe}</td>
                  <td>
                    <p>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => onEditarCompra(compra)}
                      >
                        Detalle
                      </Button>
                    </p>

                    <p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onEliminarCompra(compra.id)}
                        disabled={!editarObra}
                      >
                        Eliminar
                      </Button>
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay facturas de compras asociadas</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <p>
        <Button
          variant="info"
          size="sm"
          onClick={onAgregarCompra}
          className="me-2"
          disabled={!editarObra}
        >
          Nueva Compra
        </Button>
      </p>

      <div className="mt-3">
        <strong>Totales Compras</strong>
        <p>Total Importe Compras: {totales.importeCompras?.toFixed(2) || 0}</p>
        <p className="mt-3">
          <strong>Total Horas/Gastos</strong>
        </p>
        <p>
          Total Gastos/Horas de la Obra: {totales.gastoTotal?.toFixed(2) || 0}
        </p>
      </div>
    </>
  );
};

export default HorasGastos;
