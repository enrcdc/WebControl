// COMPONENTE JSX RELATIVO A LAS FACTURAS/PEDIDOS DE LA OBRA

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { formatearFechaLocal } from "../../../../../utils/fechasHelper.js";

const PedidosFacturas = ({
  pedidos,
  facturas,
  rentabilidad,
  editarObra,
  totales,
  onAgregarPedido,
  onEditarPedido,
  onEliminarPedido,
  onAgregarFactura,
  onEditarFactura,
  onEliminarFactura,
}) => {
  return (
    <>
      {/* Pedidos de la Obra */}
      <h5>Pedidos de la Obra</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Código Pedido</th>
            <th>Fecha</th>
            <th>Importe</th>
            <th>Facturado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map((pedido, index) => (
              <tr key={index}>
                <td>{`${pedido.codigo_pedido} - ${pedido.posicion}`}</td>
                <td>{formatearFechaLocal(pedido.fecha)}</td>
                <td>{pedido.importe}</td>
                <td>
                  {rentabilidad?.ptePedido && rentabilidad?.pteObra
                    ? (rentabilidad.ptePedido / rentabilidad.pteObra) * 100
                    : "No hay datos registrados"}
                </td>{" "}
                <td>
                  <p>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => onEditarPedido(pedido)}
                      className="me-2"
                    >
                      Detalle
                    </Button>
                  </p>
                  <p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onEliminarPedido(pedido.id_pedido)}
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
              <td colSpan="12">No hay pedidos asociados</td>
            </tr>
          )}
        </tbody>
      </table>

      <p>
        <Button
          variant="info"
          size="sm"
          onClick={() => onAgregarPedido()}
          className="me-2"
          disabled={!editarObra}
        >
          Nuevo Pedido
        </Button>
      </p>

      <div className="mt-3">
        <strong>Totales</strong>
        <p>Total Importe Pedidos: {totales.importePedidos?.toFixed(2) || 0}</p>
        <p>% Pedido de la Obra: {totales.porcentajePedido?.toFixed(2) || 0}</p>
      </div>

      {/* Facturas de la Obra */}
      <h5 className="mt-4">Facturas de la Obra</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Código Factura</th>
            <th>Fecha</th>
            <th>Cobrado</th>
            <th>Importe</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.length > 0 ? (
            facturas.map((factura, index) => (
              <tr key={index}>
                <td>{`${factura.codigo_pedido} - ${factura.posicion_pedido}`}</td>
                <td>{factura.codigo_factura}</td>
                <td>{formatearFechaLocal(factura.fecha)}</td>
                <td>{formatearFechaLocal(factura.fecha_cobro)}</td>
                <td>{factura.importe}</td>
                <td>
                  <p>
                    <Button
                      variant="info"
                      onClick={() => onEditarFactura(factura)}
                      size="sm"
                      className="me-2"
                    >
                      Detalle
                    </Button>
                  </p>
                  <p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onEliminarFactura(factura.id_factura)}
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
              <td colSpan="12">No hay facturas asociados</td>
            </tr>
          )}
        </tbody>
      </table>

      <p>
        <Button
          variant="info"
          size="sm"
          onClick={() => onAgregarFactura()}
          className="me-2"
          disabled={!editarObra}
        >
          Nueva Factura
        </Button>
      </p>

      <div className="mt-3">
        <strong>Totales</strong>
        <p>
          Total Importe Facturas: {totales.importeFacturas?.toFixed(2) || 0}
        </p>
        <p>
          % Facturado de la Obra: {totales.porcentajeFacturado?.toFixed(2) || 0}
        </p>
      </div>
    </>
  );
};

export default PedidosFacturas;
