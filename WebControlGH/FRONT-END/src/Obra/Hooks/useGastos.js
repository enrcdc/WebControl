// Hook refactorizado para gestión de gastos usando useCrudConBusqueda
import { useState, useEffect } from "react";
import { useCrudConBusqueda } from "./useCrudConBusqueda.js";
import { almacenService } from "../../Services/almacenService.js";
import { horaService } from "../../Services/horaService.js";
import { compraService } from "../../Services/compraService.js";
import { gastoService } from "../../Services/gastoService.js";
import { getTiposGastos } from "../Utils/calculos.js";

/**
 * Hook para gestión completa de gastos (horas, gastos, almacén, compras)
 * Refactorizado usando useCrudConBusqueda para movimientos de almacén y compras
 *
 * @param {number} idObra - ID de la obra
 * @returns {Object} Estado y funciones para gestionar gastos
 */
export const useGastos = (idObra) => {
  // Estados de datos (horas y gastos se cargan directamente, no son CRUD)
  const [gastos, setGastos] = useState([]);
  const [gastosHijas, setGastosHijas] = useState([]);
  const [horas, setHoras] = useState([]);
  const [horasHijas, setHorasHijas] = useState([]);
  const [horasExtra, setHorasExtra] = useState([]);
  const [horasExtraHijas, setHorasExtraHijas] = useState([]);
  const [tiposGastos, setTiposGastos] = useState([]);
  const [tiposGastosHijas, setTiposGastosHijas] = useState([]);

  // === CRUD DE MOVIMIENTOS DE ALMACÉN (con búsqueda de productos) ===
  const almacenHook = useCrudConBusqueda(
    {
      // Config CRUD
      fetchFunction: () => almacenService.getMovimientosAlmacen(idObra),
      createFunction: almacenService.createMovimientoAlmacen,
      updateFunction: almacenService.updateMovimientoAlmacen,
      deleteFunction: almacenService.deleteMovimientoAlmacen,
      initialForm: {
        idReferencia: "",
        fechaAlta: "",
        usuarioAlta: "",
        tipoMovimiento: "2",
        conceptoMovimiento: "3",
        cantidad: 0,
        importe: 0,
        observaciones: "",
        idObra: idObra,
      },
      // Transformación de datos de BD a formulario
      transformAfterFetch: (gastos) =>
        gastos.map((gasto) => ({
          idReferencia: gasto.id_referencia,
          fechaAlta: gasto.fecha_alta ? gasto.fecha_alta.split("T")[0] : "",
          usuarioAlta: gasto.codigo_usuario_alta,
          tipoMovimiento: gasto.id_tipomovimiento,
          conceptoMovimiento: gasto.id_conceptomovimiento,
          cantidad: gasto.cantidad,
          importe: gasto.importe,
          observaciones: gasto.observaciones,
          idObra: gasto.id_obra,
          id: gasto.id, // Mantener ID para edición
          descripcion_referencia: gasto.descripcion_referencia, // Para mostrar producto seleccionado
        })),
      validarForm: (form) => {
        if (
          !form.idReferencia ||
          !form.fechaAlta ||
          !form.usuarioAlta ||
          !form.idObra
        ) {
          return "Faltan campos obligatorios";
        }
        return null;
      },
      confirmDelete: "¿Estás seguro de eliminar este gasto de almacén?",
    },
    {
      // Config Búsqueda
      buscarFunction: (termino) => almacenService.buscarProductos(termino),
      fieldName: "idReferencia",
      minLength: 3,
    },
  );

  // === CRUD DE COMPRAS (con búsqueda de facturas) ===
  const comprasHook = useCrudConBusqueda(
    {
      // Config CRUD
      fetchFunction: () => compraService.getFacturasCompras(idObra),
      createFunction: compraService.createFacturaCompra,
      updateFunction: compraService.updateFacturaCompra,
      deleteFunction: compraService.deleteFacturaCompra,
      initialForm: {
        idObra: Number(idObra),
        idFacturasCompras: "",
        importe: 0,
        fechaAlta: "",
        codigoUsuarioAlta: "",
        observaciones: "",
      },
      camposNumericos: ["importe", "idObra", "codigoUsuarioAlta"],
      // Transformación de datos de BD a formulario
      transformAfterFetch: (compras) =>
        compras.map((compra) => ({
          idObra: Number(compra.id_obra),
          idFacturasCompras: compra.id_facturascompras,
          importe: compra.importe,
          fechaAlta: compra.fecha_alta?.split("T")[0] || "",
          codigoUsuarioAlta: compra.codigo_usuario_alta,
          observaciones: compra.observaciones,
          id: compra.id, // Mantener ID para edición
          Numero: compra.Numero, // Para mostrar factura seleccionada
          Concepto: compra.Concepto, // Para mostrar factura seleccionada
        })),
      validarForm: (form) => {
        if (
          !form.idFacturasCompras ||
          !form.codigoUsuarioAlta ||
          !form.fechaAlta
        ) {
          return "Faltan campos obligatorios";
        }
        return null;
      },
      confirmDelete: "¿Estás seguro de eliminar esta compra?",
    },
    {
      // Config Búsqueda
      buscarFunction: (termino) => compraService.buscarFacturas(termino),
      fieldName: "idFacturasCompras",
      minLength: 3,
    },
  );

  // === FETCH DE GASTOS (no es CRUD, solo lectura) ===
  const fetchGastos = async (idsObra, tipo = "Padre") => {
    try {
      const res = await gastoService.getGastos(idsObra);
      if (tipo === "Padre") {
        setGastos(res.data.data);
        setTiposGastos(getTiposGastos(res.data.data));
      } else {
        setGastosHijas(res.data.data);
        setTiposGastosHijas(getTiposGastos(res.data.data));
      }
    } catch (err) {
      console.error(`Error al obtener gastos (${tipo}) - ${err}`);
    }
  };

  // === FETCH DE HORAS (no es CRUD, solo lectura) ===
  const fetchHoras = async (idsObra, tipo = "Padre") => {
    try {
      const res = await horaService.getHoras(idsObra);
      tipo === "Padre" ? setHoras(res.data.data) : setHorasHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener horas (${tipo}) - ${error}`);
    }
  };

  // === FETCH DE HORAS EXTRA (no es CRUD, solo lectura) ===
  const fetchHorasExtra = async (idsObra, tipo = "Padre") => {
    try {
      const res = await horaService.getHorasExtra(idsObra);
      tipo === "Padre"
        ? setHorasExtra(res.data.data)
        : setHorasExtraHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener horas extra (${tipo}) - ${error}`);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (idObra) {
      fetchGastos([idObra]);
      fetchHoras([idObra]);
      fetchHorasExtra([idObra]);
    }
  }, [idObra]);

  return {
    // === DATOS DE GASTOS Y HORAS (solo lectura) ===
    gastos,
    gastosHijas,
    horas,
    horasHijas,
    horasExtra,
    horasExtraHijas,
    tiposGastos,
    tiposGastosHijas,
    fetchGastos,
    fetchHoras,
    fetchHorasExtra,
    setGastosHijas,
    setHorasHijas,
    setHorasExtraHijas,

    // === MOVIMIENTOS DE ALMACÉN ===
    movimientosAlmacen: almacenHook.items,
    showModalGastoAlmacen: almacenHook.showModal,
    setShowModalGastoAlmacen: almacenHook.setShowModal,
    formGastoAlmacen: almacenHook.formData,
    editIDGastoAlmacen: almacenHook.editID,
    // Búsqueda de productos
    busquedaProducto: almacenHook.busqueda,
    sugerenciasProductos: almacenHook.sugerencias,
    productoSeleccionado: almacenHook.entidadSeleccionada,
    handleBuscarProducto: almacenHook.handleBuscar,
    seleccionarProducto: almacenHook.seleccionarEntidad,
    eliminarProducto: almacenHook.eliminarEntidad,
    // Operaciones CRUD almacén
    handleAgregarGastoAlmacen: almacenHook.handleAgregar,
    handleEditarGastoAlmacen: almacenHook.handleEditar,
    handleGuardarGastoAlmacen: almacenHook.handleGuardar,
    handleEliminarGastoAlmacen: almacenHook.handleEliminar,
    handleChangeFormGastoAlmacen: almacenHook.handleChangeForm,

    // === COMPRAS ===
    facturasCompras: comprasHook.items,
    showModalCompras: comprasHook.showModal,
    setShowModalCompras: comprasHook.setShowModal,
    formCompras: comprasHook.formData,
    editIDCompra: comprasHook.editID,
    // Búsqueda de facturas
    busquedaFacturaCompra: comprasHook.busqueda,
    sugerenciasFacturasCompras: comprasHook.sugerencias,
    facturaSeleccionada: comprasHook.entidadSeleccionada,
    handleBuscarFacturaCompra: comprasHook.handleBuscar,
    seleccionarFacturaCompra: comprasHook.seleccionarEntidad,
    eliminarFacturaCompra: comprasHook.eliminarEntidad,
    // Operaciones CRUD compras
    handleAgregarCompra: comprasHook.handleAgregar,
    handleEditarCompra: comprasHook.handleEditar,
    handleGuardarCompras: comprasHook.handleGuardar,
    handleEliminarCompra: comprasHook.handleEliminar,
    handleChangeFormCompras: comprasHook.handleChangeForm,
  };
};
