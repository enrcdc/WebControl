import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, CardBody, Button } from "react-bootstrap";
import { horaService } from "../services/hora.service";

const DetalleHora = () => {
  const { codigo } = useParams(); // ruta: /home/registro-horas/detalle/:codigo
  const location = useLocation();
  const [detalle, setDetalle] = useState(location.state?.detalleHora || null);
  const [loading, setLoading] = useState(!detalle);
  const navigate = useNavigate();

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    try {
      const d = new Date(fecha);
      return d.toLocaleDateString("es-ES");
    } catch {
      return String(fecha);
    }
  };

  useEffect(() => {
    if (detalle) return;

    const fetchDetalle = async () => {
      setLoading(true);
      try {
        const res = await horaService.getAll({ codigo_usuario: codigo });
        setDetalle(res.data?.data || null);
      } catch (err) {
        console.error("Error al obtener detalle de horas:", err);
        setDetalle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [codigo, detalle]);

  if (loading) return <div>Cargando detalle...</div>;
  if (!detalle) return <div>No hay datos para este usuario.</div>;

  // Si viene un objeto único
  return (
    <div>
      <h2 style={{ color: "#eee" }}>Edición de Hora</h2>
      <Button
        variant="outline-info"
        onClick={() => navigate("/home/registro-horas")}
        style={{
          maxWidth: "150px",
          marginBlockEnd: "5px",
        }}
      >
        Volver al listado
      </Button>

      <Card>
        <Card.Header>
          <h3>
            <strong>Detalle Hora</strong>
          </h3>
        </Card.Header>
        <Card.Body>
          <Col md={8}>
            <div className="mb-3">
              <label>
                <strong>Día trabajado:</strong>
              </label>
              <div className="form-control bg-light">
                {formatearFecha(detalle.dia_trabajado)}
              </div>
            </div>

            <div className="mb-3">
              <label>
                <strong>Usuario:</strong>
              </label>
              <div className="form-control bg-light">
                {[detalle.nombre, detalle.apellido1, detalle.apellido2]
                  .filter(Boolean)
                  .join(" ") || `Usuario ${codigo}`}
                {detalle.nombre_usuario && <> ({detalle.nombre_usuario})</>}
              </div>
            </div>

            <div className="mb-3">
              <label>
                <strong>Obra:</strong>
              </label>
              <div className="form-control bg-light">
                ({detalle.codigo_obra}) {detalle.descripcion_obra}
              </div>
            </div>

            <div className="mb-3">
              <label>
                <strong>Tarea:</strong>
              </label>
              <div className="form-control bg-light">
                {detalle.tarea}
                {detalle.descripcion_tarea && (
                  <> ({detalle.descripcion_tarea})</>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label>
                <strong>Núm. horas:</strong>
              </label>
              <div className="form-control bg-light">{detalle.num_horas}</div>
            </div>

            <div className="mb-3">
              <label>
                <strong>Observaciones:</strong>
              </label>
              <div className="form-control bg-light">
                {detalle.observaciones?.trim() || "--"}
              </div>
            </div>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DetalleHora;
