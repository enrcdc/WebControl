// Hook compuesto para operaciones CRUD genéricas
import { useState, useEffect, useCallback } from "react";
import { useFormulario } from "./useFormulario.js";
import { useModal } from "./useModal.js";

/**
 * Hook genérico para operaciones CRUD (Create, Read, Update, Delete)
 * Combina useFormulario y useModal para crear un patrón CRUD completo
 *
 * @param {Object} config - Configuración del CRUD
 * @param {Function} config.fetchFunction - Función para obtener items
 * @param {Array} config.fetchParams - Parámetros para fetchFunction (default: [])
 * @param {Function} config.createFunction - Función para crear item
 * @param {Function} config.updateFunction - Función para actualizar item
 * @param {Function} config.deleteFunction - Función para eliminar item
 * @param {Object} config.initialForm - Valores iniciales del formulario
 * @param {Array<string>} config.camposNumericos - Campos numéricos del formulario
 * @param {Function} config.validarForm - Función de validación (retorna null o mensaje de error)
 * @param {string} config.confirmDelete - Mensaje de confirmación al eliminar
 * @param {Function} config.onSuccessCreate - Callback después de crear
 * @param {Function} config.onSuccessUpdate - Callback después de actualizar
 * @param {Function} config.onSuccessDelete - Callback después de eliminar
 * @param {Function} config.transformBeforeSave - Transformar datos antes de guardar
 * @param {Function} config.transformAfterFetch - Transformar datos después de cargar
 * @returns {Object} Estado y funciones CRUD
 *
 * @example
 * const pedidosHook = useCrudEntidad({
 *   fetchFunction: (ids) => pedidoService.getPedidos(ids),
 *   fetchParams: [[idObra]],
 *   createFunction: pedidoService.createPedido,
 *   updateFunction: pedidoService.updatePedido,
 *   deleteFunction: pedidoService.deletePedido,
 *   initialForm: {
 *     fechaPedido: "",
 *     codigoPedido: "",
 *     importe: 0,
 *     idObra: idObra,
 *   },
 *   camposNumericos: ['importe'],
 *   validarForm: (form) => {
 *     if (!form.codigoPedido) return "Falta el código";
 *     return null;
 *   },
 *   confirmDelete: "¿Eliminar pedido?",
 * });
 */
export const useCrudEntidad = (config) => {
  const {
    fetchFunction,
    fetchParams = [],
    createFunction,
    updateFunction,
    deleteFunction,
    initialForm = {},
    camposNumericos = [],
    validarForm = null,
    confirmDelete = "¿Estás seguro de eliminar este elemento?",
    onSuccessCreate = null,
    onSuccessUpdate = null,
    onSuccessDelete = null,
    transformBeforeSave = null,
    transformAfterFetch = null,
  } = config;

  // Estados
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hooks compuestos
  const formulario = useFormulario(initialForm, camposNumericos);
  const modal = useModal();

  /**
   * Carga los items desde la API
   */
  const fetchItems = useCallback(async () => {
    if (!fetchFunction) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetchFunction(...fetchParams);
      let data = res?.data?.data || res?.data || [];

      // NO aplicar transformación aquí - los items se guardan como vienen de la BD
      // La transformación solo se aplica al editar

      setItems(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      console.error("Error al cargar items:", err);
      return [];
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Abre el modal para agregar un nuevo item
   */
  const handleAgregar = useCallback(() => {
    formulario.resetForm();
    modal.handleOpen();
  }, [formulario, modal]);

  /**
   * Abre el modal para editar un item existente
   * @param {Object} item - Item a editar
   */
  const handleEditar = useCallback(
    (item) => {
      // Aplicar transformación si existe (para mapear campos de BD a formulario)
      const itemToEdit = transformAfterFetch
        ? transformAfterFetch([item])[0]
        : item;

      // Determinar el ID correcto basándose en el tipo de item
      // Prioridad: id_factura > id_pedido > id (genérico)
      const itemId = item.id_factura || item.id_pedido || item.id;

      formulario.setFormData(itemToEdit);
      modal.handleOpenEdit(itemId);
    },
    [formulario, modal, transformAfterFetch]
  );

  /**
   * Guarda el item (crear o actualizar)
   */
  const handleGuardar = useCallback(async () => {
    // Validar formulario
    if (validarForm) {
      const errorValidacion = validarForm(formulario.formData);
      if (errorValidacion) {
        alert(errorValidacion);
        return false;
      }
    }

    try {
      setLoading(true);

      // Aplicar transformación antes de guardar si existe
      let dataToSave = { ...formulario.formData };
      if (transformBeforeSave) {
        dataToSave = transformBeforeSave(dataToSave);
      }

      if (modal.isEditMode()) {
        // Actualizar
        const result = await updateFunction(modal.editID, dataToSave);
        if (onSuccessUpdate) {
          onSuccessUpdate(dataToSave);
        }
      } else {
        await createFunction(dataToSave);
        if (onSuccessCreate) {
          onSuccessCreate(dataToSave);
        }
      }

      modal.handleClose();
      await fetchItems();
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert(`Error al guardar: ${errorMsg}`);
      console.error("Error al guardar:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    formulario.formData,
    modal,
    validarForm,
    transformBeforeSave,
    createFunction,
    updateFunction,
    fetchItems,
    onSuccessCreate,
    onSuccessUpdate,
  ]);

  /**
   * Elimina un item
   * @param {number|string} id - ID del item a eliminar
   */
  const handleEliminar = useCallback(
    async (id) => {
      if (!window.confirm(confirmDelete)) {
        return false;
      }

      try {
        setLoading(true);
        await deleteFunction(id);

        if (onSuccessDelete) {
          onSuccessDelete(id);
        }

        await fetchItems();
        return true;
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message;
        alert(`Error al eliminar: ${errorMsg}`);
        console.error("Error al eliminar:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [deleteFunction, confirmDelete, fetchItems, onSuccessDelete]
  );

  /**
   * Alias para handleChange del formulario
   */
  const handleChangeForm = formulario.handleChange;

  // Cargar items al montar
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Datos
    items,
    loading,
    error,

    // Modal
    showModal: modal.show,
    setShowModal: modal.setShow,
    editID: modal.editID,
    isEditMode: modal.isEditMode,

    // Formulario
    formData: formulario.formData,
    handleChangeForm,
    setFormData: formulario.setFormData,
    updateFields: formulario.updateFields,
    updateField: formulario.updateField,

    // Operaciones CRUD
    handleAgregar,
    handleEditar,
    handleGuardar,
    handleEliminar,
    fetchItems,

    // Utilidades
    resetForm: formulario.resetForm,
    closeModal: modal.handleClose,
  };
};
