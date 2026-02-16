// COMPONENTE JSX RELATIVO A LA TABLA DE OBRAS

import React from "react";
import { Table, Button, Form } from "react-bootstrap";

const TablaObras = ({
  obras,
  selectedObras,
  selectAll,
  loading,
  onSelectObra,
  onSelectAll,
  onVerDetalle,
}) => {
  return (
    <div
      className="table-container"
      style={{ overflowX: "auto", maxWidth: "100%" }}
    >
      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th style={{ width: "40px" }}>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
              />
            </th>
            <th style={{ width: "60px" }}>Cód.</th>
            <th style={{ minWidth: "150px", maxWidth: "200px" }}>
              Descripción
            </th>
            <th style={{ width: "80px" }}>Tipo</th>
            <th style={{ width: "90px" }}>Estado</th>
            <th style={{ minWidth: "100px", maxWidth: "120px" }}>Empresa</th>
            <th style={{ width: "150px" }}>F. Oferta</th>
            <th style={{ width: "50px" }}>R</th>
            <th style={{ width: "60px" }}>%P.</th>
            <th style={{ width: "60px" }}>%F.</th>
            <th style={{ width: "80px" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {obras.length > 0 ? (
            obras.map((obra) => (
              <tr key={obra.id_obra}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedObras.includes(obra.id_obra)}
                    onChange={() => onSelectObra(obra.id_obra)}
                  />
                </td>
                <td
                  className="text-truncate"
                  style={{ maxWidth: "100px" }}
                  title={obra.codigo_obra}
                >
                  {obra.codigo_obra}
                </td>
                <td
                  className="text-truncate"
                  style={{ maxWidth: "150px" }}
                  title={obra.descripcion_obra}
                >
                  {obra.descripcion_obra}
                </td>
                <td className="text-truncate" title={obra.desc_tipo_obra}>
                  {obra.desc_tipo_obra}
                </td>
                <td className="text-truncate" title={obra.desc_estado_obra}>
                  {obra.desc_estado_obra}
                </td>
                <td className="text-truncate" title={obra.nombre_empresa}>
                  {obra.nombre_empresa}
                </td>
                <td className="text-nowrap">
                  {obra.fecha_oferta
                    ? new Date(obra.fecha_oferta).toLocaleDateString("es-ES")
                    : "[No ofertada]"}
                </td>
                <td className="text-center">{`${
                  obra.rentabilidadPorcentaje ?? "-"
                }%`}</td>
                <td className="text-center">
                  {`${
                    obra.importe !== 0
                      ? Math.round((obra.total_pedidos / obra.importe) * 100)
                      : 0
                  }%`}
                </td>
                <td className="text-center">{`${
                  obra.importe !== 0
                    ? Math.round((obra.total_facturas / obra.importe) * 100)
                    : 0
                }%`}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => onVerDetalle(obra.id_obra)}
                  >
                    Detalle
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                {loading ? "Cargando detalles de las obras..." : ""}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaObras;
