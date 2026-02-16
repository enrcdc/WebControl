import React, { useEffect, useState } from "react";
import {
  Collapse,
  Form,
  Button,
  Table,
  Pagination,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { compraService } from "../services/compra.service";

let allFacturas = null;

function GestionCompras() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    pendientePago: "",
    obra: "",
    pedido: "",
    origenFactura: "",
  });

  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const facturasPorPagina = 5;
  const [selectedFacturas, setSelectedFacturas] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const res = await compraService.getAll();
      const data = res.data?.data || res.data || [];
      allFacturas = data;
      setFilteredFacturas(data);
    } catch (err) {
      console.error("Error al obtener facturas", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // TODO
  const handleNuevaFactura = () => {
    navigate("/home/nueva-compra");
  };

  // Función para manejar la copia de obras seleccionadas
  const handleCopiarFacturas = () => {
    if (selectedFacturas.length === 0) {
      alert("Por favor, selecciona al menos una factura para copiar.");
      return;
    }
    console.log("Facturas seleccionadas para copiar:", selectedFacturas);
  };

  // TODO
  const handleBajaFactura = async () => {
    if (selectedFacturas.length === 0) {
      alert("Por favor, selecciona al menos una factura para eliminar.");
      return;
    }
    if (
      window.confirm("¿Estás seguro de eliminar las facturas seleccionadas?")
    ) {
      try {
        await compraService.delete(selectedFacturas);
        await fetchFacturas();
        setSelectedFacturas([]);
        alert("Facturas eliminadas correctamente");
      } catch (error) {
        console.error("Error en el proceso de borrado", error);
        alert("Error al eliminar algunas facturas");
      }
    }
  };

  // TODO
  const handleImprimirFacturas = () => {
    if (selectedFacturas.length === 0) {
      alert("Por favor, selecciona al menos una factura para imprimir.");
      return;
    }
    navigate("/home/imprimir-factura", {
      state: { selectedFacturas: selectedFacturas },
    });
  };

  const handleCheckboxChange = (facturaId) => {
    setSelectedFacturas((prevSelected) => {
      if (prevSelected.includes(facturaId)) {
        return prevSelected.filter((id) => id !== facturaId);
      } else {
        return [...prevSelected, facturaId];
      }
    });
  };

  const handleSearch = () => {
    let filtered = allFacturas;

    if (formData.fechaInicio) {
      filtered = filtered.filter(
        (factura) =>
          new Date(factura.fecha_cabecera) >= new Date(formData.fechaInicio),
      );
    }

    if (formData.fechaFin) {
      filtered = filtered.filter(
        (factura) =>
          new Date(factura.fecha_cabecera) <= new Date(formData.fechaFin),
      );
    }

    if (formData.pendientePago) {
      filtered = filtered.filter((factura) =>
        formData.pendientePago === "si"
          ? factura.cobrado === 0
          : factura.cobrado === 1,
      );
    }

    if (formData.obra) {
      filtered = filtered.filter((factura) =>
        factura.obra.includes(formData.obra),
      );
    }

    if (formData.pedido) {
      filtered = filtered.filter((factura) =>
        String(factura.pedido_pos).includes(formData.pedido),
      );
    }

    if (formData.origenFactura) {
      filtered = filtered.filter((factura) =>
        factura.origen.includes(formData.origenFactura),
      );
    }

    setFilteredFacturas(filtered);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedFacturas(filteredFacturas.map((factura) => factura.id));
    } else {
      setSelectedFacturas([]);
    }
  };

  const indexOfLastFactura = currentPage * facturasPorPagina;
  const indexOfFirstFactura = indexOfLastFactura - facturasPorPagina;
  const facturasActuales = filteredFacturas.slice(
    indexOfFirstFactura,
    indexOfLastFactura,
  );
  const totalPaginas = Math.ceil(filteredFacturas.length / facturasPorPagina);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="gestion-facturas">
      <h3>Listado de Facturas</h3>

      <div style={{ textAlign: "left" }}>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="criterios-collapse"
          aria-expanded={open}
          style={{
            backgroundColor: "#cce5ff",
            color: "#004085",
            border: "none",
            marginBottom: "1rem",
          }}
        >
          Criterios de Búsqueda
        </Button>
      </div>

      <Collapse in={open}>
        <div
          id="criterios-collapse"
          className="mb-4 p-3 border rounded"
          style={{ backgroundColor: "#e9f5ff" }}
        >
          <Form>
            <div className="row">
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label style={{ color: "black" }}>
                    Fecha Inicio Factura
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group>
                  <Form.Label style={{ color: "black" }}>
                    Fecha Fin Factura
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group>
                  <Form.Label style={{ color: "black" }}>
                    Pendiente de Pago
                  </Form.Label>
                  <Form.Select
                    name="pendientePago"
                    value={formData.pendientePago}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group>
                  <Form.Label style={{ color: "black" }}>Obra</Form.Label>
                  <Form.Control
                    type="text"
                    name="obra"
                    value={formData.obra}
                    onChange={handleChange}
                    placeholder="Escribe el nombre de la obra"
                  />
                </Form.Group>
              </div>

              <div className="col-md-3 mt-3">
                <Form.Group>
                  <Form.Label style={{ color: "black" }}>Pedido</Form.Label>
                  <Form.Control
                    type="text"
                    name="pedido"
                    value={formData.pedido}
                    onChange={handleChange}
                    placeholder="Código de pedido"
                  />
                </Form.Group>
              </div>

              <div className="col-md-3 mt-3">
                <Form.Group>
                  <Form.Label style={{ color: "black" }}>
                    Origen Factura
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="origenFactura"
                    value={formData.origenFactura}
                    onChange={handleChange}
                    placeholder="Origen de factura"
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </div>
      </Collapse>

      <div className="d-flex mb-4">
        <Form.Control
          type="text"
          placeholder="Busque por nombre y descripción"
          className="me-2"
          style={{ maxWidth: "400px" }}
        />
        <Button
          variant="primary"
          onClick={handleSearch}
          style={{ width: "auto" }}
        >
          Buscar
        </Button>
      </div>

      <Container>
        <Row className="mb-3">
          <Col md={4} className="text-end">
            <Button onClick={handleNuevaFactura} className="custom-button">
              Nueva Factura
            </Button>
            <Button onClick={handleBajaFactura} className="custom-button">
              Baja Factura
            </Button>
            <Button onClick={handleCopiarFacturas} className="custom-button">
              Importar Facturas desde DQEMS
            </Button>
            <Button onClick={handleImprimirFacturas} className="custom-button">
              Imprimir Facturas
            </Button>
          </Col>
        </Row>
      </Container>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Orig.</th>
            <th>Factura-Pos</th>
            <th>Pedido-Pos</th>
            <th>Obra</th>
            <th>Fecha</th>
            <th>ConceptoF</th>
            <th>ConceptoL</th>
            <th>Cobrado?</th>
            <th>Importe</th>
            <th>Obs.F.Import</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {facturasActuales.length > 0 ? (
            facturasActuales.map((factura, index) => (
              <tr key={index}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedFacturas.includes(factura.id)}
                    onChange={() => handleCheckboxChange(factura.id)}
                  />
                </td>
                <td>{factura.origen}</td>
                <td>{factura.factura_pos}</td>
                <td>{factura.pedido_pos}</td>
                <td>{factura.obra}</td>
                <td>{factura.fecha_cabecera}</td>
                <td>{factura.concepto_f}</td>
                <td>{factura.concepto_l}</td>
                <td>{factura.cobrado === 1 ? "Sí" : "[NO]"}</td>
                <td>{factura.importe}</td>
                <td>{factura.obs_imp}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() =>
                      navigate(
                        `/home/gestion-compras/detalle/${factura.numero}`,
                      )
                    }
                  >
                    Detalle
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No se encontraron facturas</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <Pagination.Item
            key={i}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default GestionCompras;
