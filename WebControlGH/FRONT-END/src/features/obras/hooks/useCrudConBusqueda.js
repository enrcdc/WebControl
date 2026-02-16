// Hook compuesto para CRUD con búsqueda de entidad relacionada
import { useCrudEntidad } from "./useCrudEntidad.js";
import { useBusquedaEntidad } from "./useBusquedaEntidad.js";

/**
 * Hook que combina CRUD con búsqueda de entidad relacionada
 * Útil para casos como:
 * - Movimientos de almacén (búsqueda de productos)
 * - Compras (búsqueda de facturas)
 * - Cualquier CRUD que necesite seleccionar una entidad relacionada
 *
 * @param {Object} config - Configuración del CRUD (ver useCrudEntidad)
 * @param {Object} busquedaConfig - Configuración de búsqueda
 * @param {Function} busquedaConfig.buscarFunction - Función de búsqueda
 * @param {string} busquedaConfig.fieldName - Nombre del campo en el form donde guardar el ID
 * @param {number} busquedaConfig.minLength - Mínimo de caracteres para buscar
 * @returns {Object} Estado y funciones CRUD + búsqueda
 *
 * @example
 * // Movimientos de almacén con búsqueda de productos
 * const almacenHook = useCrudConBusqueda({
 *   // Configuración CRUD
 *   fetchFunction: () => almacenService.getMovimientosAlmacen(idObra),
 *   createFunction: almacenService.createMovimientoAlmacen,
 *   updateFunction: almacenService.updateMovimientoAlmacen,
 *   deleteFunction: almacenService.deleteMovimientoAlmacen,
 *   initialForm: { idReferencia: '', cantidad: 0, ... },
 *   // ... más config CRUD
 * }, {
 *   // Configuración búsqueda
 *   buscarFunction: (termino) => almacenService.buscarProductos(termino),
 *   fieldName: 'idReferencia',
 *   minLength: 2,
 * });
 *
 * // Usar en el componente
 * <input value={almacenHook.busqueda} onChange={almacenHook.handleBuscar} />
 * {almacenHook.sugerencias.map(prod => (
 *   <li onClick={() => almacenHook.seleccionarEntidad(prod)}>
 *     {prod.descripcion}
 *   </li>
 * ))}
 */
export const useCrudConBusqueda = (config, busquedaConfig) => {
  const {
    buscarFunction,
    fieldName = "idReferencia",
    minLength = 3,
  } = busquedaConfig;

  // Hook CRUD base
  const crud = useCrudEntidad(config);

  // Hook de búsqueda
  const busqueda = useBusquedaEntidad(buscarFunction, { minLength });

  /**
   * Selecciona una entidad y actualiza el formulario
   * @param {Object} entidad - Entidad seleccionada
   */
  const seleccionarEntidad = (entidad) => {
    busqueda.seleccionar(entidad);

    // Actualizar el formulario con el ID de la entidad seleccionada
    crud.updateField(fieldName, entidad.id);
  };

  /**
   * Elimina la entidad seleccionada y limpia el campo del formulario
   */
  const eliminarEntidad = () => {
    busqueda.eliminarSeleccion();
    crud.updateField(fieldName, "");
  };

  /**
   * Abre el modal para agregar, limpiando la búsqueda
   */
  const handleAgregarConLimpieza = () => {
    crud.handleAgregar();
    busqueda.limpiar();
  };

  /**
   * Abre el modal para editar, estableciendo la entidad si existe
   * @param {Object} item - Item a editar (con nombres de BD)
   * @param {Object} entidadInicial - Entidad relacionada inicial (opcional)
   */
  const handleEditarConEntidad = (item, entidadInicial = null) => {
    crud.handleEditar(item);

    // Si no se proporciona entidadInicial pero el item tiene datos de la entidad, extraerla
    if (!entidadInicial) {
      // Para almacén: item tiene descripcion_referencia (nombre de BD)
      if (item.descripcion_referencia) {
        const entidad = {
          id: item.id_referencia, // Usar nombre de BD
          descripcion: item.descripcion_referencia,
        };
        busqueda.setEntidadSeleccionada(entidad);
      }
      // Para compras: item tiene Numero y Concepto
      else if (item.Numero || item.Concepto) {
        const entidad = {
          id: item.id_facturascompras, // Usar nombre de BD
          Numero: item.Numero,
          Concepto: item.Concepto,
        };
        busqueda.setEntidadSeleccionada(entidad);
      }
    } else if (entidadInicial) {
      busqueda.setEntidadSeleccionada(entidadInicial);
    }
  };

  return {
    // Propiedades del CRUD
    ...crud,

    // Propiedades de búsqueda
    busqueda: busqueda.busqueda,
    sugerencias: busqueda.sugerencias,
    entidadSeleccionada: busqueda.entidadSeleccionada,
    loadingBusqueda: busqueda.loading,

    // Funciones de búsqueda
    handleBuscar: busqueda.handleBuscar,
    seleccionarEntidad,
    eliminarEntidad,
    limpiarBusqueda: busqueda.limpiar,

    // Funciones CRUD con soporte de búsqueda
    handleAgregar: handleAgregarConLimpieza,
    handleEditar: handleEditarConEntidad,
  };
};
