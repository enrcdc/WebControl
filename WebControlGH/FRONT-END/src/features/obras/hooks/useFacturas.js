// Hook refactorizado para gestión de facturas usando useCrudEntidad
import { useCrudEntidad } from "./useCrudEntidad.js";
import { facturaService } from "../../facturas";

/**
 * Hook para gestión completa de facturas (CRUD)
 * Refactorizado usando useCrudEntidad
 *
 * @param {number} idObra - ID de la obra
 * @param {Array} pedidos - Array de pedidos (para autorellenar importe)
 * @returns {Object} Estado y funciones para gestionar facturas
 */
export const useFacturas = (idObra, pedidos = []) => {
  const facturasHook = useCrudEntidad({
    // Configuración de fetch
    fetchFunction: (ids) => facturaService.getByObras(ids),
    fetchParams: [[idObra]],

    // Configuración de operaciones CRUD
    createFunction: (data) => facturaService.create(data),
    updateFunction: (id, data) => facturaService.update(id, data),
    deleteFunction: (id) => facturaService.delete([id]),

    // Formulario inicial
    initialForm: {
      idPedido: "",
      codigoPedido: "",
      fechaFactura: new Date().toISOString().split("T")[0],
      codigo: "",
      posicion: "",
      importe: "",
      conceptoFactura: "",
      conceptoLinea: "",
      observaciones: "",
      idObra: idObra,
      cobrado: false,
      fechaCobro: new Date().toISOString().split("T")[0],
    },

    // Transformación de datos de BD a formulario (solo para edición)
    transformAfterFetch: (facturas) =>
      facturas.map((factura) => ({
        idPedido: factura.id_pedido || "",
        codigoPedido: factura.codigo_pedido || "",
        fechaFactura: factura.fecha ? factura.fecha.split("T")[0] : "",
        codigo: factura.codigo_factura || "",
        posicion: factura.posicion || "",
        importe: factura.importe || 0,
        conceptoFactura: factura.concepto_factura || "",
        conceptoLinea: factura.concepto_linea || "",
        observaciones: factura.observaciones || "",
        idObra: factura.id_obra,
        cobrado: factura.fecha_cobro ? true : false,
        fechaCobro: factura.fecha_cobro
          ? factura.fecha_cobro.split("T")[0]
          : new Date().toISOString().split("T")[0],
        id_factura: factura.id_factura, // Mantener ID para edición
      })),

    // Validación
    validarForm: (form) => {
      if (!form.idPedido || !form.codigo || !form.posicion || !form.importe) {
        return "Faltan campos obligatorios: pedido, código, posición o importe";
      }
      return null;
    },

    // Mensaje de confirmación al eliminar
    confirmDelete: "¿Estás seguro de eliminar esta factura?",
  });

  /**
   * Handler personalizado que maneja el autorellenado de importe desde pedido
   */
  const handleChangeFormFactura = (e) => {
    facturasHook.handleChangeForm(e);

    // Auto-rellenar importe desde pedido seleccionado
    if (e.target.name === "idPedido" && pedidos) {
      const pedidoSeleccionado = pedidos.find(
        (p) => p.id_pedido == e.target.value,
      );
      if (pedidoSeleccionado) {
        facturasHook.updateField("importe", pedidoSeleccionado.importe);
      }
    }
  };

  // Función separada para fetch de facturas de obras hijas
  const fetchFacturasHijas = async (idsObras) => {
    try {
      const res = await facturaService.getByObras(idsObras);
      return res.data.data || [];
    } catch (error) {
      console.error(`Error al obtener facturas de hijas - ${error}`);
      return [];
    }
  };

  return {
    // Renombrar 'items' a 'facturas' para mantener compatibilidad
    facturas: facturasHook.items,

    // Resto de propiedades del CRUD
    loading: facturasHook.loading,
    error: facturasHook.error,
    showModal: facturasHook.showModal,
    setShowModal: facturasHook.setShowModal,
    editID: facturasHook.editID,
    formData: facturasHook.formData,

    // Funciones CRUD con handler personalizado
    handleAgregar: facturasHook.handleAgregar,
    handleEditar: facturasHook.handleEditar,
    handleGuardar: facturasHook.handleGuardar,
    handleEliminar: facturasHook.handleEliminar,
    handleChangeForm: handleChangeFormFactura, // Handler personalizado
    fetchFacturas: facturasHook.fetchItems,

    // Función adicional para facturas de hijas
    fetchFacturasHijas,
  };
};
