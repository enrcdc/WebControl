// COMPONENTE JSX RELATIVO A LAS ALERTAS DE OBRAS ESPECIALES

import React from "react";
import { Alert, Form, Button } from "react-bootstrap";

const AlertasObras = ({
  obrasSuperadas,
  obrasFacturadas,
  obrasSeguimiento,
  obrasSinPedidosConHoras,
  obraSuperadaSelec,
  setObraSuperadaSelec,
  obraFacturadaSelec,
  setObraFacturadaSelec,
  obraSeguimientoSelec,
  setObraSeguimientoSelec,
  obraSinPedidosConHorasSelec,
  setObraSinPedidosConHorasSelec,
  onVerDetalle,
  onFinalizar,
}) => {
  return (
    <>
      {/* Alerta de Obras Superadas */}
      <Alert variant="danger">
        Hay {obrasSuperadas.length} obras confirmadas cuyo número de horas
        imputadas supera las horas previstas.
        <Form.Select onChange={(e) => setObraSuperadaSelec(e.target.value)}>
          <option value="">Seleccionar obra...</option>
          {obrasSuperadas.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion_obra} - Gastos Generales:{" "}
              {obra.gastoGeneral} - Horas Previstas: {obra.horas_previstas} -
              Horas Imputadas: {obra.horasTotal}
            </option>
          ))}
        </Form.Select>
        <Button
          className="custom-button mt-2"
          disabled={!obraSuperadaSelec}
          onClick={() => onVerDetalle(obraSuperadaSelec)}
        >
          Ver Detalles
        </Button>
      </Alert>

      {/* Alerta de Obras Facturadas */}
      <Alert variant="success">
        Hay {obrasFacturadas.length} obras confirmadas, totalmente facturadas
        hace más de 30 días.
        <Form.Select onChange={(e) => setObraFacturadaSelec(e.target.value)}>
          <option value="">Seleccionar obra...</option>
          {obrasFacturadas.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion_obra} - Última Factura:{" "}
              {new Date(obra.fecha_ultima_factura).toLocaleDateString("es-ES")}
            </option>
          ))}
        </Form.Select>
        <div className="d-flex gap-2 mt-2">
          <Button
            className="custom-button"
            disabled={!obraFacturadaSelec}
            onClick={() => onVerDetalle(obraFacturadaSelec)}
          >
            Ver Detalles
          </Button>
          <Button
            className="custom-button"
            onClick={() => onFinalizar(obraFacturadaSelec)}
            disabled={!obraFacturadaSelec}
          >
            Finalizar
          </Button>
        </div>
      </Alert>

      {/* Alerta de Obras en Seguimiento */}
      <Alert variant="purple">
        Hay {obrasSeguimiento.length} obras en seguimiento.
        <Form.Select onChange={(e) => setObraSeguimientoSelec(e.target.value)}>
          <option value="">Seleccionar obra...</option>
          {obrasSeguimiento.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion} - Fecha de Seguimiento:{" "}
              {new Date(obra.fecha_seg).toLocaleDateString("es-ES")} - Motivo:{" "}
              {obra.descripcion_seg}
            </option>
          ))}
        </Form.Select>
        <Button
          className="custom-button mt-2"
          disabled={!obraSeguimientoSelec}
          onClick={() => onVerDetalle(obraSeguimientoSelec)}
        >
          Ver Detalles
        </Button>
      </Alert>

      {/* Alerta de Obras sin Pedidos con Horas */}
      <Alert variant="warning">
        Existen {obrasSinPedidosConHoras.length} obras sin pedido en las que se
        han imputado horas. Pulse para acceder a la lista
        <Form.Select
          onChange={(e) => setObraSinPedidosConHorasSelec(e.target.value)}
        >
          <option value="">Seleccionar obra...</option>
          {obrasSinPedidosConHoras.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion} - Horas totales:{" "}
              {obra.total_horas} - Importe pedidos: {obra.total_pedidos}
            </option>
          ))}
        </Form.Select>
        <Button
          className="custom-button mt-2"
          disabled={!obraSinPedidosConHorasSelec}
          onClick={() => onVerDetalle(obraSinPedidosConHorasSelec)}
        >
          Ver Detalles
        </Button>
      </Alert>
    </>
  );
};

export default AlertasObras;
