// Hook refactorizado para gestión de pedidos usando useCrudEntidad
import { useCrudEntidad } from "../../../hooks/useCrudEntidad";
import { pedidoService } from "../../pedidos";

/**
 * Hook para gestión completa de pedidos (CRUD)
 * Refactorizado usando useCrudEntidad para eliminar código repetitivo
 *
 * @param {number} idObra - ID de la obra
 * @returns {Object} Estado y funciones para gestionar pedidos
 */
export const usePedidos = (idObra) => {
  const pedidosHook = useCrudEntidad({
    // Configuración de fetch
    fetchFunction: (ids) => pedidoService.filtrar({ idsObra: ids }),
    fetchParams: [[idObra]],

    // Configuración de operaciones CRUD
    createFunction: (data) => pedidoService.create(data),
    updateFunction: (id, data) => pedidoService.update(id, data),
    deleteFunction: (id) => pedidoService.delete([id]),

    // Formulario inicial
    initialForm: {
      fechaPedido: "",
      codigoPedido: "",
      posicion: "",
      importe: "",
      observaciones: "",
      idObra: idObra,
    },

    // Transformación de datos de BD a formulario (solo para edición)
    transformAfterFetch: (pedidos) =>
      pedidos.map((pedido) => ({
        fechaPedido: pedido.fecha ? pedido.fecha.split("T")[0] : "",
        codigoPedido: pedido.codigo_pedido || "",
        posicion: pedido.posicion || "",
        importe: pedido.importe || 0,
        observaciones: pedido.observaciones || "",
        idObra: pedido.id_obra,
        id_pedido: pedido.id_pedido, // Mantener ID para edición
      })),

    // Validación
    validarForm: (form) => {
      if (
        !form.codigoPedido ||
        !form.fechaPedido ||
        !form.importe ||
        !form.posicion
      ) {
        return "Faltan campos obligatorios: código, fecha, importe o posición";
      }
      return null;
    },

    // Mensaje de confirmación al eliminar
    confirmDelete: "¿Estás seguro de eliminar este pedido?",
  });

  // Función separada para fetch de pedidos de obras hijas
  const fetchPedidosHijas = async (idsObra) => {
    try {
      const res = await pedidoService.filtrar({ idsObra });
      return res.data.data || [];
    } catch (error) {
      console.error(`Error al obtener pedidos de hijas - ${error}`);
      return [];
    }
  };

  return {
    // Renombrar 'items' a 'pedidos' para mantener compatibilidad
    pedidos: pedidosHook.items,

    // Resto de propiedades del CRUD
    loading: pedidosHook.loading,
    error: pedidosHook.error,
    showModal: pedidosHook.showModal,
    setShowModal: pedidosHook.setShowModal,
    editID: pedidosHook.editID,
    formData: pedidosHook.formData,

    // Funciones CRUD
    handleAgregar: pedidosHook.handleAgregar,
    handleEditar: pedidosHook.handleEditar,
    handleGuardar: pedidosHook.handleGuardar,
    handleEliminar: pedidosHook.handleEliminar,
    handleChangeForm: pedidosHook.handleChangeForm,
    fetchPedidos: pedidosHook.fetchItems,

    // Función adicional para pedidos de hijas
    fetchPedidosHijas,
  };
};
