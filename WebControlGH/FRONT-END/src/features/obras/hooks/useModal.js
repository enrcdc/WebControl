// Hook atómico para gestión de estado de modales
import { useState, useCallback } from "react";

/**
 * Hook genérico para gestionar el estado de modales (CRUD)
 *
 * @returns {Object} Estado y funciones del modal
 * @property {boolean} show - Si el modal está visible
 * @property {number|string|null} editID - ID del elemento en edición (null si es creación)
 * @property {Function} handleOpen - Abre el modal en modo creación
 * @property {Function} handleOpenEdit - Abre el modal en modo edición
 * @property {Function} handleClose - Cierra el modal
 * @property {Function} isEditMode - Retorna true si está en modo edición
 *
 * @example
 * const { show, editID, handleOpen, handleOpenEdit, handleClose, isEditMode } = useModal();
 *
 * // Abrir para crear
 * handleOpen();
 *
 * // Abrir para editar
 * handleOpenEdit(123);
 *
 * // Verificar modo
 * if (isEditMode()) {
 *   console.log('Editando ID:', editID);
 * }
 */
export const useModal = () => {
  const [show, setShow] = useState(false);
  const [editID, setEditID] = useState(null);

  /**
   * Abre el modal en modo creación (sin editID)
   */
  const handleOpen = useCallback(() => {
    setEditID(null);
    setShow(true);
  }, []);

  /**
   * Abre el modal en modo edición
   * @param {number|string} id - ID del elemento a editar
   */
  const handleOpenEdit = useCallback((id) => {
    setEditID(id);
    setShow(true);
  }, []);

  /**
   * Cierra el modal y resetea el editID
   */
  const handleClose = useCallback(() => {
    setShow(false);
    setEditID(null);
  }, []);

  /**
   * Indica si el modal está en modo edición
   * @returns {boolean} true si editID no es null
   */
  const isEditMode = useCallback(() => {
    return editID !== null;
  }, [editID]);

  return {
    show,
    editID,
    handleOpen,
    handleOpenEdit,
    handleClose,
    isEditMode,
    setShow, // Exponer setter por si se necesita control manual
  };
};
