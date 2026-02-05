// COMPONENTE JSX RELATIVO A LOS FILTROS DE BUSQUEDA DE OBRAS

import React from "react";
import { Accordion, Form } from "react-bootstrap";

const FiltrosObras = ({ formData, catalogos, onChangeForm }) => {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Criterios de Búsqueda</Accordion.Header>
        <Accordion.Body>
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
                      Fecha Inicio
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={onChangeForm}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Fecha Fin
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={onChangeForm}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>Complejo</Form.Label>
                    <Form.Control
                      as="select"
                      name="complejo"
                      value={formData.complejo}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      {catalogos.edificios.length > 0 ? (
                        catalogos.edificios.map((edificio) => (
                          <option
                            key={edificio.id}
                            value={edificio.nombre}
                          >
                            {edificio.nombre}
                          </option>
                        ))
                      ) : (
                        <option>Cargando complejos...</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>Empresa</Form.Label>
                    <Form.Control
                      as="select"
                      name="empresa"
                      value={formData.empresa}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      {catalogos.empresas.length > 0 ? (
                        catalogos.empresas.map((empresa) => (
                          <option
                            key={empresa.id}
                            value={empresa.nombre}
                          >
                            {empresa.nombre}
                          </option>
                        ))
                      ) : (
                        <option>Cargando empresas...</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      En Seguimiento
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="enSeguimiento"
                      value={formData.enSeguimiento}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="Si">SÍ</option>
                      <option value="No">NO</option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Estado de la obra
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="estadoObra"
                      value={formData.estadoObra}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      {catalogos.estadosObra.length > 0 ? (
                        catalogos.estadosObra.map((estado) => (
                          <option
                            key={estado.codigo_estado}
                            value={estado.descripcion_estado}
                          >
                            {estado.descripcion_estado}
                          </option>
                        ))
                      ) : (
                        <option>Cargando estados de obra...</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Tipo de obra
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="tipoObra"
                      value={formData.tipoObra}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      {catalogos.tiposObra.length > 0 ? (
                        catalogos.tiposObra.map((tipo) => (
                          <option key={tipo.id_tipo} value={tipo.descripcion}>
                            {tipo.descripcion}
                          </option>
                        ))
                      ) : (
                        <option>Cargando tipos de obra...</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Obras ofertadas
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="ofertada"
                      value={formData.ofertada}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="Si">SÍ</option>
                      <option value="No">NO</option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Obras con pedidos
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="conPedido"
                      value={formData.conPedido}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="Si">SÍ</option>
                      <option value="No">NO</option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Obras con facturas
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="conFactura"
                      value={formData.conFactura}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="Si">SÍ</option>
                      <option value="No">NO</option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Obras con horas
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="conHoras"
                      value={formData.conHoras}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="Si">SÍ</option>
                      <option value="No">NO</option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Obras con gastos
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="conGastos"
                      value={formData.conGastos}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="Si">SÍ</option>
                      <option value="No">NO</option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label style={{ color: "black" }}>
                      Relación entre obras
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="relacionEntreObras"
                      value={formData.relacionEntreObras}
                      onChange={onChangeForm}
                    >
                      <option value="">-</option>
                      <option value="mostrarHijas">
                        Mostrar solo obras hija
                      </option>
                      <option value="mostrarPadres">
                        Mostrar solo obras padre
                      </option>
                      <option value="mostrarPadresHijas">
                        Mostrar solo obras padre/hija
                      </option>
                      <option value="ocultarHijas">
                        Ocultar solo obras hija
                      </option>
                      <option value="ocultarPadres">
                        Ocultar solo obras padre
                      </option>
                      <option value="ocultarPadresHijas">
                        Ocultar obras padre/hija
                      </option>
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Check
                    type="checkbox"
                    name="obrasDadasDeBaja"
                    label="Mostrar obras dadas de Baja"
                    checked={formData.obrasDadasDeBaja}
                    onChange={onChangeForm}
                    className="mt-3"
                  />
                </div>
              </div>
            </Form>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default FiltrosObras;
