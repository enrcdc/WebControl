// components/DetalleObra/index.js
import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Accordion } from "react-bootstrap";

// Hooks personalizados
import { useObraData } from "../../hooks/useObraData.js";
import { usePedidos } from "../../hooks/usePedidos.js";
import { useFacturas } from "../../hooks/useFacturas.js";
import { useGastos } from "../../hooks/useGastos.js";
import { useObrasRelacionadas } from "../../hooks/useObrasRelacionadas.js";
import { useCalculos } from "../../hooks/useCalculos.js";

// Componentes
import InformacionGeneral from "./Components/InformacionGeneral";
import CatalogosObra from "./Components/CatalogosObra";
import PedidosFacturas from "./Components/PedidosFacturas";
import HorasGastos from "./Components/HorasGastos";
import HorasGastosSubordinadas from "./Components/HorasGastosSubordinadas";
import ResumenObra from "./Components/ResumenObra";
import ResumenSubordinadas from "./Components/ResumenSubordinadas";
import ResumenTotal from "./Components/ResumenTotal";

// Modales
import ModalPedido from "./Components/Modals/ModalPedidos.jsx";
import ModalFactura from "./Components/Modals/ModalFacturas.jsx";
import ModalGastoAlmacen from "./Components/Modals/ModalGastoAlmacen.jsx";
import ModalCompra from "./Components/Modals/ModalCompra.jsx";

const DetalleObra = () => {
  const { idObra } = useParams();
  const navigate = useNavigate();

  // Hook principal de la obra
  const {
    obra,
    rentabilidad,
    formObra,
    catalogos,
    loading,
    editarObra,
    enSeguimiento,
    ofertado,
    setEditarObra,
    handleChangeFormObra,
    handleChangeSeguimiento,
    handleChangeOfertado,
    handleGuardarObra,
    handleCancelarObra,
    handleBajarObra,
  } = useObraData(idObra);

  // Hooks de datos
  const pedidosHook = usePedidos(idObra);
  const facturasHook = useFacturas(idObra, pedidosHook.pedidos);
  const gastosHook = useGastos(idObra);
  const obrasRelacionadasHook = useObrasRelacionadas(idObra);

  // Hook de cálculos
  const calculos = useCalculos({
    obra,
    pedidos: pedidosHook.pedidos,
    facturas: facturasHook.facturas,
    gastos: gastosHook.gastos,
    horas: gastosHook.horas,
    horasExtra: gastosHook.horasExtra,
    movimientosAlmacen: gastosHook.movimientosAlmacen,
    facturasCompras: gastosHook.facturasCompras,
    obrasHijas: obrasRelacionadasHook.obrasHijas,
    gastosHijas: gastosHook.gastosHijas,
    horasHijas: gastosHook.horasHijas,
    horasExtraHijas: gastosHook.horasExtraHijas,
    pedidosHijas: pedidosHook.pedidosHijas,
    facturasHijas: facturasHook.facturasHijas,
  });

  useEffect(() => {
    const idsObrasHijas = obrasRelacionadasHook.obrasHijas.map(
      (obra) => obra.id_obra,
    );

    if (idsObrasHijas.length > 0) {
      // Fetch de gastos, horas, pedidos y facturas de obras hijas
      gastosHook.fetchGastos(idsObrasHijas, "Hijas");
      gastosHook.fetchHoras(idsObrasHijas, "Hijas");
      gastosHook.fetchHorasExtra(idsObrasHijas, "Hijas");
      pedidosHook.fetchPedidos(idsObrasHijas, "Hijas");
      facturasHook.fetchFacturas(idsObrasHijas, "Hijas");
    } else {
      // Si no hay obras hijas, limpiar los datos
      gastosHook.setGastosHijas([]);
      gastosHook.setHorasHijas([]);
      gastosHook.setHorasExtraHijas([]);
    }
  }, [obrasRelacionadasHook.obrasHijas.length]);

  const handleGuardarCambios = async () => {
    await obrasRelacionadasHook.handleGuardarRelaciones();
    await handleGuardarObra();
  };

  const handleCancelarCambios = () => {
    obrasRelacionadasHook.handleCancelarRelaciones();
    handleCancelarObra();
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <h2>Cargando...</h2>
      </Container>
    );
  }

  if (!obra || Object.keys(obra).length === 0) {
    return (
      <Container className="mt-4">
        <h2>Obra no encontrada</h2>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Edición de Obra</h2>

      {/* Información General de la Obra */}
      <InformacionGeneral
        formObra={formObra}
        editarObra={editarObra}
        enSeguimiento={enSeguimiento}
        obraPadre={obrasRelacionadasHook.obraPadre}
        obrasHijas={obrasRelacionadasHook.obrasHijas}
        sugerenciasPadre={obrasRelacionadasHook.sugerenciasPadre}
        sugerenciasHijas={obrasRelacionadasHook.sugerenciasHijas}
        busquedaPadre={obrasRelacionadasHook.busquedaPadre}
        busquedaHijas={obrasRelacionadasHook.busquedaHijas}
        onChangeFormObra={handleChangeFormObra}
        onChangeSeguimiento={handleChangeSeguimiento}
        onBuscarObraPadre={obrasRelacionadasHook.handleBuscarPadre}
        onSeleccionarObraPadre={obrasRelacionadasHook.seleccionarObraPadre}
        onEliminarObraPadre={obrasRelacionadasHook.eliminarObraPadre}
        onBuscarObraHija={obrasRelacionadasHook.handleBuscarHija}
        onAgregarObraHija={obrasRelacionadasHook.agregarObraHija}
        onEliminarObraHija={obrasRelacionadasHook.eliminarObraHija}
      />

      {/* Botones de Acción */}
      <div className="d-flex mt-3 mb-3">
        <Button
          variant="primary"
          className="w-auto px-3 me-2"
          onClick={
            editarObra ? handleGuardarCambios : () => setEditarObra(true)
          }
        >
          {editarObra ? "Guardar cambios" : "Editar obra"}
        </Button>
        <Button
          variant="danger"
          className="w-auto px-3"
          onClick={
            editarObra ? handleCancelarCambios : () => handleBajarObra(navigate)
          }
        >
          {editarObra ? "Cancelar cambios" : "Baja Obra"}
        </Button>
      </div>

      <Accordion defaultActiveKey="0">
        {/* Catálogos */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Información General</Accordion.Header>
          <Accordion.Body>
            <CatalogosObra
              formObra={formObra}
              catalogos={catalogos}
              editarObra={editarObra}
              ofertado={ofertado}
              onChangeFormObra={handleChangeFormObra}
              onChangeOfertado={handleChangeOfertado}
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* Pedidos y Facturas */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Pedidos y Facturas de la Obra</Accordion.Header>
          <Accordion.Body>
            <PedidosFacturas
              pedidos={pedidosHook.pedidos}
              facturas={facturasHook.facturas}
              rentabilidad={rentabilidad}
              editarObra={editarObra}
              totales={{
                importePedidos: calculos.totalImportePedidos,
                importeFacturas: calculos.totalImporteFacturas,
                porcentajePedido: calculos.porcentajePedido,
                porcentajeFacturado: calculos.porcentajeFacturado,
              }}
              onAgregarPedido={pedidosHook.handleAgregar}
              onEditarPedido={pedidosHook.handleEditar}
              onEliminarPedido={pedidosHook.handleEliminar}
              onAgregarFactura={facturasHook.handleAgregar}
              onEditarFactura={facturasHook.handleEditar}
              onEliminarFactura={facturasHook.handleEliminar}
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* Horas y Gastos */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Horas y Gastos</Accordion.Header>
          <Accordion.Body>
            <HorasGastos
              horas={gastosHook.horas}
              horasExtra={gastosHook.horasExtra}
              gastos={gastosHook.gastos}
              movimientosAlmacen={gastosHook.movimientosAlmacen}
              facturasCompras={gastosHook.facturasCompras}
              tiposGastos={gastosHook.tiposGastos}
              rentabilidad={rentabilidad}
              editarObra={editarObra}
              totales={{
                horas: calculos.totalHoras,
                importeHoras: calculos.totalImporteHoras,
                horasExtra: calculos.totalHorasExtra,
                importeHorasExtra: calculos.totalImporteHorasExtra,
                importeGastos: calculos.totalImporteGastos,
                importeAlmacen: calculos.totalImporteMovimientosAlmacen,
                importeCompras: calculos.totalImporteCompras,
                gastoTotal: calculos.gastoTotal,
              }}
              onAgregarGastoAlmacen={gastosHook.handleAgregarGastoAlmacen}
              onEditarGastoAlmacen={gastosHook.handleEditarGastoAlmacen}
              onEliminarGastoAlmacen={gastosHook.handleEliminarGastoAlmacen}
              onAgregarCompra={gastosHook.handleAgregarCompra}
              onEditarCompra={gastosHook.handleEditarCompra}
              onEliminarCompra={gastosHook.handleEliminarCompra}
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* Horas y Gastos Subordinadas - Solo si hay obras hijas */}
        {obrasRelacionadasHook.obrasHijas.length > 0 && (
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              Horas y Gastos Obras Subordinadas
            </Accordion.Header>
            <Accordion.Body>
              <HorasGastosSubordinadas
                horasHijas={gastosHook.horasHijas}
                horasExtraHijas={gastosHook.horasExtraHijas}
                gastosHijas={gastosHook.gastosHijas}
                tiposGastosHijas={gastosHook.tiposGastosHijas}
                totales={{
                  horasSub: calculos.totalHorasSub,
                  importeHorasSub: calculos.totalImporteHorasSub,
                  horasExtraSub: calculos.totalHorasExtraSub,
                  importeHorasExtraSub: calculos.totalImporteHorasExtraSub,
                  importeGastosSub: calculos.totalImporteGastosSub,
                  gastoTotalSub: calculos.gastoTotalSub,
                }}
              />
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Resumen Obra */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>Resumen Obra</Accordion.Header>
          <Accordion.Body>
            <ResumenObra obra={obra} totales={calculos} />
          </Accordion.Body>
        </Accordion.Item>

        {/* Resumen Obras Subordinadas - Solo si hay obras hijas */}
        {obrasRelacionadasHook.obrasHijas.length > 0 && (
          <>
            <Accordion.Item eventKey="5">
              <Accordion.Header>Resumen Obras Subordinadas</Accordion.Header>
              <Accordion.Body>
                <ResumenSubordinadas totales={calculos} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>Resumen Obras + Subordinadas</Accordion.Header>
              <Accordion.Body>
                <ResumenTotal obra={obra} totales={calculos} />
              </Accordion.Body>
            </Accordion.Item>
          </>
        )}
      </Accordion>

      {/* Botón Volver */}
      <Button className="mt-4" onClick={() => navigate(-1)}>
        Volver
      </Button>

      {/* Modales */}
      <ModalPedido
        show={pedidosHook.showModal}
        formData={pedidosHook.formData}
        editID={pedidosHook.editID}
        onHide={() => pedidosHook.setShowModal(false)}
        onChangeForm={pedidosHook.handleChangeForm}
        onGuardar={pedidosHook.handleGuardar}
      />

      <ModalFactura
        show={facturasHook.showModal}
        formData={facturasHook.formData}
        editID={facturasHook.editID}
        pedidos={pedidosHook.pedidos}
        onHide={() => facturasHook.setShowModal(false)}
        onChangeForm={facturasHook.handleChangeForm}
        onGuardar={facturasHook.handleGuardar}
      />

      <ModalGastoAlmacen
        show={gastosHook.showModalGastoAlmacen}
        formData={gastosHook.formGastoAlmacen}
        editID={gastosHook.editIDGastoAlmacen}
        obra={obra}
        usuarios={catalogos.usuarios}
        productoSeleccionado={gastosHook.productoSeleccionado}
        sugerenciasProductos={gastosHook.sugerenciasProductos}
        busquedaProducto={gastosHook.busquedaProducto}
        onHide={() => gastosHook.setShowModalGastoAlmacen(false)}
        onChangeForm={gastosHook.handleChangeFormGastoAlmacen}
        onGuardar={gastosHook.handleGuardarGastoAlmacen}
        onBuscarProducto={gastosHook.handleBuscarProducto}
        onSeleccionarProducto={gastosHook.seleccionarProducto}
        onEliminarProducto={gastosHook.eliminarProducto}
      />

      <ModalCompra
        show={gastosHook.showModalCompras}
        formData={gastosHook.formCompras}
        editID={gastosHook.editIDCompra}
        usuarios={catalogos.usuarios}
        facturaSeleccionada={gastosHook.facturaSeleccionada}
        sugerenciasFacturas={gastosHook.sugerenciasFacturasCompras}
        busquedaFactura={gastosHook.busquedaFacturaCompra}
        onHide={() => gastosHook.setShowModalCompras(false)}
        onChangeForm={gastosHook.handleChangeFormCompras}
        onGuardar={gastosHook.handleGuardarCompras}
        onBuscarFactura={gastosHook.handleBuscarFacturaCompra}
        onSeleccionarFactura={gastosHook.seleccionarFacturaCompra}
        onEliminarFactura={gastosHook.eliminarFacturaCompra}
      />
    </Container>
  );
};

export default DetalleObra;
